import { db, storage } from "@/lib/firebase";
import { collection, addDoc, query, where, doc, getDoc, orderBy, updateDoc, getDocs, writeBatch, limit, startAfter } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { Project } from "../types/project";
import { validateProjectName, validateId } from "@/lib/validators";

export const projectsService = {
  // 1. Get a single project by ID
  getProjectById: async (projectId: string) => {
    validateId(projectId, "Project ID");

    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project;
    }
    return null;
  },

  // 2. Get a paginated list of projects
  getProjectsPage: async (userId: string, lastDoc: any = null, pageSize: number = 10) => {
    validateId(userId, "User ID");

    let q = query(
      collection(db, "projects"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
    const hasMore = snapshot.docs.length === pageSize;

    return { data: projects, lastVisible, hasMore };
  },

  // 3. Create a new project
  createProject: async (name: string, userId: string) => {
    validateId(userId, "User ID");
    const validName = validateProjectName(name);

    const docRef = await addDoc(collection(db, "projects"), {
      name: validName,
      userId,
      createdAt: new Date().toISOString(),
    });

    return docRef.id;
  },

  // 4. Update project name
  updateProjectName: async (projectId: string, newName: string) => {
    validateId(projectId, "Project ID");
    const validName = validateProjectName(newName);

    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Project "${projectId}" not found.`);
    }

    await updateDoc(docRef, {
      name: validName,
    });
  },

  // 5. Delete project and all associated tasks + their images
  deleteProject: async (projectId: string, userId: string) => {
    validateId(projectId, "Project ID");
    validateId(userId, "User ID");

    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      throw new Error(`Project "${projectId}" not found.`);
    }

    // Query all tasks associated with this project (userId required by Firestore rules)
    const tasksQuery = query(
      collection(db, "tasks"),
      where("projectId", "==", projectId),
      where("userId", "==", userId)
    );
    const tasksSnapshot = await getDocs(tasksQuery);

    // Delete images from Storage (before batch, since Storage isn't transactional)
    for (const taskDoc of tasksSnapshot.docs) {
      const imageUrl = taskDoc.data().imageUrl;
      if (imageUrl) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.error(`Failed to delete image for task "${taskDoc.id}":`, error);
        }
      }
    }

    // Use a batch to atomically delete all task documents + the project document
    const batch = writeBatch(db);

    for (const taskDoc of tasksSnapshot.docs) {
      batch.delete(taskDoc.ref);
    }
    batch.delete(projectRef);

    await batch.commit();
  }
};