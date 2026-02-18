import { LogOut, ChevronsUpDown } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import type { IUser } from "@/types/auth_types";
import { getFirstCharAfterPrefix } from "@/utils/navbar-item";
import { useLogoutUser } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const SidebarUser = ({ userProfile }: { userProfile: IUser }) => {
  const { mutateAsync: logoutUser } = useLogoutUser();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();

      queryClient.setQueryData(["authUser"], null);

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      queryClient.setQueryData(["authUser"], null);
      navigate("/login", { replace: true });
    }
  };
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="size-10 rounded-lg text-lg font-bold shrink-0 bg-primary text-primary-foreground flex items-center justify-center pointer-events-none">
                {getFirstCharAfterPrefix(userProfile.fullname || "U")}
              </div>
              <div className="grid flex-1 text-left leading-tight ml-2">
                <span className="truncate text-base font-semibold">
                  {userProfile.fullname}
                </span>
                <span className="truncate text-sm text-muted-foreground">
                  {userProfile.username}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            onCloseAutoFocus={() => {}}
          >
            {/* Header label inside the menu for extra context */}
            <DropdownMenuLabel className="p-2 font-normal">
              <div className="flex items-center text-left text-sm">
                <div className="size-10 rounded-lg text-lg font-bold shrink-0 bg-primary text-primary-foreground flex items-center justify-center pointer-events-none">
                  {getFirstCharAfterPrefix(userProfile.fullname || "U")}
                </div>
                <div className="grid flex-1 text-left leading-tight ml-2">
                  <span className="truncate text-base font-semibold">
                    {userProfile.fullname}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    {userProfile.username}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer py-3 text-base font-medium"
            >
              <LogOut className="mr-3 size-5" />
              ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarUser;
