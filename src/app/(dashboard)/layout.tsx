import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthGuard } from "@/features/auth/components/AuthGuard"; // <-- 1. Importar

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
        <main className="flex-1 min-h-screen bg-stone-50 dark:bg-stone-950 relative">
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