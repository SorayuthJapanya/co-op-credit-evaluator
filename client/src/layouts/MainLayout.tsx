import AppSidebar from "@/components/layout/AppSidebar";
import Navbar from "@/components/layout/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { IUser } from "@/types/auth_types";
import { memo } from "react";

interface MainLayoutProps {
  authUser: IUser;
  children: React.ReactNode;
}

const MainLayout = memo(({ authUser, children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar userProfile={authUser} />
      <SidebarInset>
        <Navbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
});

MainLayout.displayName = "MainLayout";

export default MainLayout;
