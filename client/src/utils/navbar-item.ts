import { Briefcase, Database, FileText, FilePlus, LayoutDashboard, Lock, Users, FileStack } from "lucide-react";

export const getFirstCharAfterPrefix = (fullname: string): string => {
  if (!fullname) return "";
  const prefixRegex = /^(?:นางสาว|นาย|นาง)\s*(.)/u;
  const match = fullname.trim().match(prefixRegex);
  return match ? match[1] : fullname.trim().charAt(0);
};

export interface NavbarItem {
  title: string;
  path: string;
  icon: typeof LayoutDashboard;
  role?: "SUPER_ADMIN";
}

export const navbarItem: NavbarItem[] = [
  {
    title: "แดชบอร์ด",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "เอกสารการประเมิน",
    path: "/credit-evaluator",
    icon: FileText,
  },
  {
    title: "สร้างเอกสารการประเมิน",
    path: "/credit-evaluator/add",
    icon: FilePlus,
  },
  {
    title: "จัดการสมาชิก",
    path: "/manage-member",
    icon: Users,
  },
  {
    title: "จัดการหมวดหมู่อาชีพ",
    path: "/manage-career-category",
    icon: Briefcase,
  },
  {
    title: "เอกสารประเมินทั้งหมด",
    path: "/all-evaluations",
    icon: FileStack,
    role: "SUPER_ADMIN",
  },
  {
    title: "จัดการผู้ใช้",
    path: "/manage-admins",
    icon: Lock,
    role: "SUPER_ADMIN",
  },
  {
    title: "Log",
    path: "/evaluate-logs",
    icon: Database,
    role: "SUPER_ADMIN",
  },
];
