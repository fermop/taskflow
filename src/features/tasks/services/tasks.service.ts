import { db, storage } from "@/lib/firebase";
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc, orderBy, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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
  // 1. Crear Tarea (con imagen opcional)
  createTask: async (projectId: string, title: string, userId: string, file: File | null) => {
    let imageUrl = "";

    if (file) {
      const storageRef = ref(storage, `tareas/${projectId}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    const docRef = await addDoc(collection(db, "tasks"), {
      title: title,
      projectId: projectId,
      userId: userId,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      imageUrl: imageUrl,
    });

    return docRef.id;
  },

  // 2. Escuchar Tareas en Tiempo Real
  subscribeToTasks: (projectId: string, onUpdate: (tasks: Task[]) => void) => {
    const q = query(
      collection(db, "tasks"),
      where("projectId", "==", projectId),
      orderBy("createdAt", "desc")
    );
    
    // Retornamos el unsubscribe para que el componente pueda limpiar el listener
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      const sortedTasks = tasks.sort((a, b) => 
        (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1
      );

      onUpdate(sortedTasks);
    });
  },

  // 3. Actualizar Estado
  toggleCompletion: async (taskId: string, currentStatus: boolean) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { isCompleted: !currentStatus });
  },

  updateTask: async (taskId: string, title: string, projectId: string, newFile: File | null) => {
    const taskRef = doc(db, "tasks", taskId);
    const updatedData: Partial<Task> = { title };

    if (newFile) {
      // Delete the previous image from Storage if one exists
      const taskSnapshot = await getDoc(taskRef);
      const previousImageUrl = taskSnapshot.data()?.imageUrl;

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
    }

    await updateDoc(taskRef, updatedData);
  },

  // 4. Eliminar
  deleteTask: async (taskId: string) => {
    await deleteDoc(doc(db, "tasks", taskId));
  }
};