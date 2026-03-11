"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/Navbar";
import { FolderKanban, ListChecks, Users, GitBranch, Star, Heart, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen bg-stone-50 dark:bg-[oklch(0.14_0.005_60)] px-4 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-400/15 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-stone-200 dark:border-stone-700/50 bg-white/80 dark:bg-stone-800/60 text-sm text-stone-600 dark:text-stone-400 backdrop-blur-sm">
            <Star className="w-4 h-4 text-amber-500" />
            Proyecto open source
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-stone-900 dark:text-stone-50 mb-6 tracking-tight leading-[1.1]">
            Organiza tus proyectos con{" "}
            <span className="text-amber-600 dark:text-amber-400">TaskFlow</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-500 dark:text-stone-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            El TaskFlow definitivo. Crea proyectos, asigna tareas y
            colabora en tiempo real con una interfaz moderna y sencilla.
          </p>

          <div className="flex justify-center gap-4 min-h-[50px] items-center">
            {loading ? (
              <Skeleton className="h-12 w-75 rounded-xl" />
            ) : user ? (
              <Link
                href="/proyectos"
                className="px-8 py-3 bg-amber-600 dark:bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-700 dark:hover:bg-amber-400 transition-all duration-200 shadow-md shadow-amber-600/20 dark:shadow-amber-500/20 flex items-center gap-2 hover:shadow-lg hover:shadow-amber-600/25"
              >
                Ir a mis proyectos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-amber-600 dark:bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-700 dark:hover:bg-amber-400 transition-all duration-200 shadow-md shadow-amber-600/20 dark:shadow-amber-500/20 hover:shadow-lg"
                >
                  Comenzar gratis
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-2.5 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 transition-all duration-200 hover:border-stone-300"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Acerca de ── */}
      <section id="about" className="py-24 bg-white dark:bg-stone-950 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-4 tracking-tight">
              ¿Qué es TaskFlow?
            </h2>
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
              TaskFlow es una aplicación web diseñada para ayudarte a gestionar
              tus proyectos y tareas diarias de forma visual, rápida y
              organizada. Todo en tiempo real, desde cualquier dispositivo.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-3 gap-5 mb-20">
            <div className="rounded-2xl ring-1 ring-stone-200/80 dark:ring-stone-800 bg-stone-50/50 dark:bg-stone-900/50 p-6 hover:ring-stone-300 dark:hover:ring-stone-700 transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <FolderKanban className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Proyectos organizados
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Crea y administra múltiples proyectos. Cada uno con su propia
                lista de tareas, todo separado y ordenado.
              </p>
            </div>

            <div className="rounded-2xl ring-1 ring-stone-200/80 dark:ring-stone-800 bg-stone-50/50 dark:bg-stone-900/50 p-6 hover:ring-stone-300 dark:hover:ring-stone-700 transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <ListChecks className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Tareas con imágenes
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Agrega, edita y completa tareas. Adjunta imágenes para dar
                contexto visual a cada actividad.
              </p>
            </div>

            <div className="rounded-2xl ring-1 ring-stone-200/80 dark:ring-stone-800 bg-stone-50/50 dark:bg-stone-900/50 p-6 hover:ring-stone-300 dark:hover:ring-stone-700 transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Autenticación segura
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                Inicia sesión con tu correo o con Google. Tus datos están
                protegidos con Firebase Authentication.
              </p>
            </div>
          </div>

          {/* Preview: Proyectos */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Vista de Proyectos
            </h3>
            <p className="text-stone-500 dark:text-stone-400 mb-6">
              Visualiza todos tus proyectos de un vistazo y accede a cualquiera
              con un solo clic.
            </p>
            <div className="rounded-2xl ring-1 ring-stone-200 dark:ring-stone-800 bg-stone-100/50 dark:bg-stone-900/50 aspect-video relative overflow-hidden">
              {/* Light Mode Image */}
              <Image
                src="/projects-preview-light.png"
                alt="Vista de proyectos"
                fill
                className="object-cover dark:hidden"
              />
              {/* Dark Mode Image */}
              <Image
                src="/projects-preview-dark.png"
                alt="Vista de proyectos"
                fill
                className="hidden dark:block object-cover"
              />
            </div>
          </div>

          {/* Preview: Tareas */}
          <div>
            <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Vista de Tareas
            </h3>
            <p className="text-stone-500 dark:text-stone-400 mb-6">
              Gestiona las tareas dentro de cada proyecto: crea, edita, marca
              como completadas y adjunta imágenes.
            </p>
            <div className="rounded-2xl ring-1 ring-stone-200 dark:ring-stone-800 bg-stone-100/50 dark:bg-stone-900/50 aspect-video relative overflow-hidden">
              {/* Light Mode Image */}
              <Image
                src="/tasks-preview-light.png"
                alt="Vista de tareas"
                fill
                className="object-cover dark:hidden"
              />
              {/* Dark Mode Image */}
              <Image
                src="/tasks-preview-dark.png"
                alt="Vista de tareas"
                fill
                className="hidden dark:block object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Contribuye ── */}
      <section id="contribute" className="py-24 bg-stone-50 dark:bg-[oklch(0.14_0.005_60)] px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-7 h-7 text-pink-600 dark:text-pink-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-50 mb-4 tracking-tight">
            ¡Contribuye al proyecto!
          </h2>
          <p className="text-lg text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
            TaskFlow es un proyecto <strong className="text-stone-800 dark:text-stone-200">100% open source</strong>.
            Si te apasiona el desarrollo web, quieres practicar tus habilidades
            o simplemente mejorar una herramienta que ya usas, tu contribución
            es bienvenida. Desde corregir un bug hasta proponer nuevas
            funcionalidades, toda ayuda suma.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left">
            <div className="rounded-xl ring-1 ring-stone-200 dark:ring-stone-800 bg-white dark:bg-stone-900/60 p-5 hover:ring-stone-300 dark:hover:ring-stone-700 transition-all duration-200">
              <div className="flex items-center gap-3 mb-2">
                <GitBranch className="w-5 h-5 text-stone-400" />
                <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                  Haz un fork
                </h3>
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Clona el repositorio, crea una rama con tu mejora y envía un
                pull request. Revisaremos tu código lo antes posible.
              </p>
            </div>

            <div className="rounded-xl ring-1 ring-stone-200 dark:ring-stone-800 bg-white dark:bg-stone-900/60 p-5 hover:ring-stone-300 dark:hover:ring-stone-700 transition-all duration-200">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-stone-900 dark:text-stone-100">
                  Deja una estrella
                </h3>
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Si te gusta el proyecto, déjanos una ⭐ en GitHub. Nos ayuda a
                llegar a más personas y motiva al equipo.
              </p>
            </div>
          </div>

          <a
            href="https://github.com/fermop/taskflow"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold rounded-xl hover:bg-stone-800 dark:hover:bg-stone-200 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Ver en GitHub
          </a>
        </div>
      </section>

      {/* ── Preguntas Frecuentes ── */}
      <section id="faq" className="py-24 bg-white dark:bg-stone-950 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-4 tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-stone-500 dark:text-stone-400">
              Todo lo que necesitas saber sobre TaskFlow.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-stone-200 dark:border-stone-800 rounded-xl px-4 bg-stone-50/50 dark:bg-stone-900/50">
              <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:no-underline font-semibold py-4 cursor-pointer">
                ¿Qué es TaskFlow?
              </AccordionTrigger>
              <AccordionContent className="text-stone-500 dark:text-stone-400 pb-4 leading-relaxed">
                TaskFlow es una herramienta de gestión de proyectos diseñada para equipos y desarrolladores que buscan simplicidad y eficiencia. Permite organizar tareas, adjuntar archivos y colaborar en tiempo real.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-stone-200 dark:border-stone-800 rounded-xl px-4 bg-stone-50/50 dark:bg-stone-900/50">
              <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:no-underline font-semibold py-4 cursor-pointer">
                ¿Es realmente gratuito?
              </AccordionTrigger>
              <AccordionContent className="text-stone-500 dark:text-stone-400 pb-4 leading-relaxed">
                ¡Sí! TaskFlow es un proyecto de código abierto y su uso es completamente gratuito. Puedes usar nuestra instancia oficial o desplegar tu propia versión.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-stone-200 dark:border-stone-800 rounded-xl px-4 bg-stone-50/50 dark:bg-stone-900/50">
              <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:no-underline font-semibold py-4 cursor-pointer">
                ¿Cómo puedo contribuir?
              </AccordionTrigger>
              <AccordionContent className="text-stone-500 dark:text-stone-400 pb-4 leading-relaxed">
                ¡Nos encanta recibir ayuda! Puedes contribuir reportando errores, sugiriendo funciones o enviando Pull Requests en nuestro repositorio de GitHub. No olvides dejar una estrella si te gusta.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-stone-200 dark:border-stone-800 rounded-xl px-4 bg-stone-50/50 dark:bg-stone-900/50">
              <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:no-underline font-semibold py-4 cursor-pointer">
                ¿Mis datos están seguros?
              </AccordionTrigger>
              <AccordionContent className="text-stone-500 dark:text-stone-400 pb-4 leading-relaxed">
                Utilizamos Firebase para la autenticación y el almacenamiento de datos, lo que garantiza estándares de seguridad de nivel industrial. Tus datos personales y archivos están protegidos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-stone-200 dark:border-stone-800 rounded-xl px-4 bg-stone-50/50 dark:bg-stone-900/50">
              <AccordionTrigger className="text-stone-900 dark:text-stone-100 hover:no-underline font-semibold py-4 cursor-pointer">
                ¿Puedo subir imágenes a mis tareas?
              </AccordionTrigger>
              <AccordionContent className="text-stone-500 dark:text-stone-400 pb-4 leading-relaxed">
                Sí, TaskFlow permite adjuntar una imagen a cada tarea para proporcionar contexto visual. Estas imágenes se almacenan de forma segura en Firebase Storage.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 bg-white dark:bg-stone-950 border-t border-stone-200/80 dark:border-stone-800/50 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">
            © {new Date().getFullYear()} TaskFlow — Hecho con{" "}
            <Heart className="w-3.5 h-3.5 inline text-pink-500" /> por la
            comunidad open source.
          </p>
        </div>
      </footer>
    </>
  );
}