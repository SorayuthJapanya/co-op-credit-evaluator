import { Briefcase, FileText, LayoutDashboard, Users } from "lucide-react";

export const getFirstCharAfterPrefix = (fullname: string): string => {
  if (!fullname) return "";
  const prefixRegex = /^(?:นางสาว|นาย|นาง)\s*(.)/u;
  const match = fullname.trim().match(prefixRegex);
  return match ? match[1] : fullname.trim().charAt(0);
};

export const navbarItem = [
  {
    title: "แดชบอร์ด",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "เอกสารการประเมิน",
    path: "/credit-evaluator",
    icon: FileText,
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
];
