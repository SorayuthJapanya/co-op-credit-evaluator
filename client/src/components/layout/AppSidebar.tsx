import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Lock, Database } from "lucide-react";
import { navbarItem } from "@/utils/navbar-item";
import type { IUser } from "@/types/auth_types";
import { useLocationMemo } from "@/hooks/useLocationMemo";
import { memo } from "react";
import SidebarUser from "../SidebarUser";

const AppSidebar = memo(({ userProfile }: { userProfile: IUser }) => {
  const location = useLocationMemo();

  return (
    <Sidebar className="z-40">
      <SidebarHeader className="border-b ">
        <SidebarMenu>
          <div className="flex items-center justify-center gap-3">
            <img
              src="/credit-evaluator-icon.png"
              alt="credit-evaluator-icon"
              className="w-16 h-auto hover:scale-110 duration-300 transition-transform cursor-pointer"
            />
            <div className="grid flex-1 text-left leading">
              <span className="truncate text-lg font-bold">
                สหกรณ์เครดิตยูเนี่ยน
              </span>
              <span className="truncate text-sm font-medium text-muted-foreground">
                สันกว๊าน จำกัด
              </span>
            </div>
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-sidebar-foreground/80 my-2">
            เมนูหลัก
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navbarItem.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      tooltip={item.title}
                      isActive={isActive}
                      className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90 "
                    >
                      <a href={item.path}>
                        <IconComponent className="size-5" />
                        <span className="text-base">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {userProfile?.role === "SUPER_ADMIN" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-semibold text-sidebar-foreground/80 my-2">
              Administrator
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    tooltip="จัดการผู้ใช้"
                    isActive={location.pathname === "/manage-admins"}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90"
                  >
                    <a href="/manage-admins">
                      <Lock className="size-5" />
                      <span className="text-base">จัดการผู้ใช้</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    tooltip="Log"
                    isActive={location.pathname === "/evaluate-logs"}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90"
                  >
                    <a href="/evaluate-logs">
                      <Database className="size-5" />
                      <span className="text-base">Log</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="w-full">
        <SidebarUser userProfile={userProfile} />
      </SidebarFooter>
    </Sidebar>
  );
});

AppSidebar.displayName = "AppSidebar";

export default AppSidebar;
