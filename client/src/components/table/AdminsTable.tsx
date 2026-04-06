import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { IAdmin } from "@/types/superadmin_types";
import Swal from "sweetalert2";

interface AdminsTableProps {
  admins: IAdmin[];
  onRoleUpdate: (id: string, newRole: "ADMIN" | "SUPER_ADMIN") => void;
  onDelete: (id: string, name: string) => void;
  currentUserId: string;
}

const AdminsTable = ({ admins, onRoleUpdate, onDelete, currentUserId }: AdminsTableProps) => {
  const handleRoleToggle = (admin: IAdmin) => {
    if (admin.id === currentUserId) {
      Swal.fire({
        icon: "warning",
        title: "ไม่สามารถเปลี่ยนสิทธิ์ตัวเองได้",
        text: "คุณไม่สามารถลดสิทธิ์ผู้ดูแลระบบสูงสุดของตัวคุณเองได้",
        confirmButtonText: "รับทราบ",
      });
      return;
    }

    const newRole = admin.role === "SUPER_ADMIN" ? "ADMIN" : "SUPER_ADMIN";
    
    Swal.fire({
      icon: "question",
      title: "ยืนยันการเปลี่ยนแปลงสิทธิ์",
      text: `คุณต้องการเปลี่ยนสิทธิ์ของ ${admin.fullname} เป็น ${newRole} ใช่หรือไม่?`,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        onRoleUpdate(admin.id, newRole);
      }
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-16 text-center whitespace-nowrap">ลำดับ</TableHead>
            <TableHead className="text-center whitespace-nowrap">วันที่สร้าง</TableHead>
            <TableHead className="whitespace-nowrap">Username</TableHead>
            <TableHead className="whitespace-nowrap">ชื่อ - นามสกุล</TableHead>
            <TableHead className="text-center whitespace-nowrap">สิทธิ์การใช้งาน (Role)</TableHead>
            <TableHead className="text-center w-32 whitespace-nowrap">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-10">
                ไม่พบข้อมูลผู้ใช้งาน
              </TableCell>
            </TableRow>
          ) : (
            admins.map((admin, index) => (
              <TableRow key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="text-center text-gray-500">{index + 1}</TableCell>
                <TableCell className="text-gray-700 text-center whitespace-nowrap">
                  {formatDate(admin.created_at)}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">{admin.username}</TableCell>
                <TableCell className="whitespace-nowrap">{admin.fullname}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-3 py-1 font-medium rounded-md text-xs tracking-wider whitespace-nowrap ${
                      admin.role === "SUPER_ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {admin.role}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleRoleToggle(admin)}
                      disabled={admin.id === currentUserId}
                    >
                      เปลี่ยนสิทธิ์
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                      onClick={() => onDelete(admin.id, admin.fullname)}
                      disabled={admin.id === currentUserId}
                      title="ลบผู้ใช้งาน"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminsTable;
