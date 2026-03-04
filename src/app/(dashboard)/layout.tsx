import { AppSidebar } from "@/components/features/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthGuard } from "@/components/features/AuthGuard"; // <-- 1. Importar

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 2. Envolver todo dentro del AuthGuard
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 min-h-screen bg-zinc-50 dark:bg-zinc-900 relative">
          <div className="absolute top-4 left-4">
            <SidebarTrigger />
          </div>
          <div className="pt-16 px-4">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </AuthGuard>
  );
}