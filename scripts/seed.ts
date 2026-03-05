import { loadEnvConfig } from '@next/env';
import { collection, addDoc } from "firebase/firestore";

loadEnvConfig(process.cwd());
process.env.NODE_ENV = 'development';

async function main() {
  console.log("🌱 Iniciando el proceso de seeding en Firestore...");

  try {
    const { db } = await import("../src/lib/firebase");

    const proyectosFalsos = [
      {
        name: "Yogurt Artesanal DUX - MVP",
        createdAt: new Date().toISOString(),
        userId: "",
      },
      {
        name: "Sistema de Nómina",
        createdAt: new Date().toISOString(),
        userId: "",
      }
    ];

    const tareasFalsas = [
      "Diseñar el Sidebar responsivo",
      "Configurar Firebase Emulators",
      "Crear el CRUD de productos",
      "Implementar Dark Mode",
      "Hablar con Samuel sobre los requerimientos"
    ];

    const projectsRef = collection(db, "projects");
    const tasksRef = collection(db, "tasks");

    for (const proyecto of proyectosFalsos) {
      const docRef = await addDoc(projectsRef, proyecto);
      const nuevoProyectoId = docRef.id;
      console.log(`✅ Proyecto creado: ${proyecto.name} (ID: ${nuevoProyectoId})`);

      for (const tituloTarea of tareasFalsas) {
        await addDoc(tasksRef, {
          title: tituloTarea,
          projectId: nuevoProyectoId,
          imageURL: "",
          userId: "", 
          isCompleted: Math.random() > 0.5,
          createdAt: new Date().toISOString(),
        });
      }
    }

    console.log("✨ ¡Base de datos poblada con éxito!");
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Error crítico ejecutando el seeder:", error);
    process.exit(1);
  }
}

main();