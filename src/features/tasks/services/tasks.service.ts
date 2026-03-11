import { db, storage } from "@/lib/firebase";
import { collection, addDoc, query, where, doc, updateDoc, deleteDoc, orderBy, getDoc, getDocs, limit, startAfter } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { validateTaskTitle, validateImageFile, validateId } from "@/lib/validators";

export interface Task {
  id: string;
  title: string;
  projectId: string;
  userId: string;
  isCompleted: boolean;
  createdAt: string;
  imageUrl?: string;
}

export const tasksService = {
  // 1. Create task (with optional image)
  createTask: async (projectId: string, title: string, userId: string, file: File | null) => {
    validateId(projectId, "Project ID");
    validateId(userId, "User ID");
    const validTitle = validateTaskTitle(title);
    if (file) validateImageFile(file);

    let imageUrl = "";

    if (file) {
      const storageRef = ref(storage, `tareas/${projectId}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    const docRef = await addDoc(collection(db, "tasks"), {
      title: validTitle,
      projectId,
      userId,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      imageUrl,
    });

    return docRef.id;
  },

  // 2. Get a paginated list of tasks
  getTasksPage: async (projectId: string, userId: string, lastDoc: any = null, pageSize: number = 15) => {
    validateId(projectId, "Project ID");
    validateId(userId, "User ID");

    let q = query(
      collection(db, "tasks"),
      where("projectId", "==", projectId),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];

    const sortedTasks = tasks.sort((a, b) =>
      (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1
    );

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
    const hasMore = snapshot.docs.length === pageSize;

    return { data: sortedTasks, lastVisible, hasMore };
  },

  // 3. Toggle task completion
  toggleCompletion: async (taskId: string, currentStatus: boolean) => {
    validateId(taskId, "Task ID");

    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { isCompleted: !currentStatus });
  },

  // 4. Update task info (title, image)
  updateTask: async (taskId: string, title: string, projectId: string, newFile: File | null, removeImage: boolean = false) => {
    validateId(taskId, "Task ID");
    validateId(projectId, "Project ID");
    const validTitle = validateTaskTitle(title);
    if (newFile) validateImageFile(newFile);

    const taskRef = doc(db, "tasks", taskId);
    const updatedData: Partial<Task> = { title: validTitle };

    // Fetch existing task to check for a previous image
    const taskSnapshot = await getDoc(taskRef);
    if (!taskSnapshot.exists()) {
      throw new Error(`Task "${taskId}" not found.`);
    }
    const previousImageUrl = taskSnapshot.data()?.imageUrl;

    if (newFile) {
      // Delete the previous image from Storage if one exists
      if (previousImageUrl) {
        try {
          const previousImageRef = ref(storage, previousImageUrl);
          await deleteObject(previousImageRef);
        } catch (error) {
          console.error("Failed to delete previous image from Storage:", error);
        }
      }

      // Upload the new image
      const storageRef = ref(storage, `tareas/${projectId}/${Date.now()}_${newFile.name}`);
      await uploadBytes(storageRef, newFile);
      const newImageUrl = await getDownloadURL(storageRef);
      updatedData.imageUrl = newImageUrl;
    } else if (removeImage && previousImageUrl) {
      // Remove the stored image without replacing it
      try {
        const previousImageRef = ref(storage, previousImageUrl);
        await deleteObject(previousImageRef);
      } catch (error) {
        console.error("Failed to delete image from Storage:", error);
      }
      updatedData.imageUrl = "";
    }

    await updateDoc(taskRef, updatedData);
  },

  // 5. Delete task and associated image
  deleteTask: async (taskId: string) => {
    validateId(taskId, "Task ID");

    const taskRef = doc(db, "tasks", taskId);
    const taskSnapshot = await getDoc(taskRef);

    if (!taskSnapshot.exists()) {
      throw new Error(`Task "${taskId}" not found.`);
    }

    const imageUrl = taskSnapshot.data()?.imageUrl;

    // Delete the associated image from Storage if one exists
    if (imageUrl) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Failed to delete task image from Storage:", error);
      }
    }

    await deleteDoc(taskRef);
  }
};