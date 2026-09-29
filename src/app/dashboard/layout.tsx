import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getCurrentUser } from "@/action/action";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { name, email } = await getCurrentUser();
  return (
    <SidebarProvider>
      <AppSidebar userName={name} userEmail={email} />
      <SidebarInset>
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
