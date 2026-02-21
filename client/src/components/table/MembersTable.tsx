import { useState } from "react";
import { Edit, Trash2, User } from "lucide-react";
import type { IMember } from "@/types/member_types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDateToThai } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MemberDetailModal from "../modal/MemberDetailModal";
import UpdateMemberForm from "../form/UpdateMemberForm";
import Swal from "sweetalert2";
import { useDeleteMember } from "@/hooks/useMember";
import { useNavigate } from "react-router-dom";

interface MembersTableProps {
  members: IMember[];
}

const MembersTable = ({ members }: MembersTableProps) => {
  const [selectedMember, setSelectedMember] = useState<IMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const navigate = useNavigate();

  const { mutateAsync: deleteMember } = useDeleteMember();

  const handleRowClick = (member: IMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, member: IMember) => {
    e.stopPropagation();
    setSelectedMember(member);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, member: IMember) => {
    e.stopPropagation();
    Swal.fire({
      icon: "question",
      title: "ยืนยันการลบข้อมูลสมาชิก?",
      text: `คุณแน่ใจใช่ไหมว่าจะลบข้อมูลของ ${member.fullName}`,
      showCancelButton: true,
      confirmButtonText: "ยืนยันลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังลบข้อมูล...",
          text: "กรุณารอสักครู่",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await deleteMember(member.id);
        navigate("/manager-members");
        Swal.close();
      }
    });
  };

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-16 text-center">ลำดับ</TableHead>
            <TableHead className="text-center">เลขบัตรประชาชน</TableHead>
            <TableHead className="text-center">รหัสสมาชิก</TableHead>
            <TableHead>ชื่อสกุล</TableHead>
            <TableHead className="text-right">จำนวนหุ้น</TableHead>
            <TableHead className="text-right">มูลค่าหุ้น</TableHead>
            <TableHead className="text-center">วันที่เข้าร่วม</TableHead>
            <TableHead className="text-center">ที่อยู่</TableHead>
            <TableHead className="text-center">หมู่</TableHead>
            <TableHead className="text-center">ตำบล</TableHead>
            <TableHead className="text-center">อำเภอ</TableHead>
            <TableHead className="text-center">จังหวัด</TableHead>
            <TableHead className="text-center w-24">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, index) => (
            <TableRow
              key={member.id}
              className="group cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => handleRowClick(member)}
            >
              <TableCell className="text-center text-gray-500">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium text-center">
                {member.idCard}
              </TableCell>
              <TableCell className="text-gray-700 text-center">
                {member.memberId}
              </TableCell>
              <TableCell>{member.fullName}</TableCell>
              <TableCell className="text-right text-gray-700">
                {member.sharesNum?.toLocaleString() || "0"}
              </TableCell>
              <TableCell className="text-right text-green-600 font-medium whitespace-nowrap">
                ฿ {member.sharesValue?.toLocaleString() || "0"}
              </TableCell>
              <TableCell className="text-gray-700 text-center">
                {formatDateToThai(member.joiningDate || "")}
              </TableCell>
              <TableCell className="text-gray-700 text-center">
                {member.address}
              </TableCell>
              <TableCell className="text-gray-700 text-center">
                {member.moo}
              </TableCell>
              <TableCell className="text-gray-700 text-center">
                {member.subdistrict}
              </TableCell>
              <TableCell className="text-gray-700 text-center">
                {member.district}
              </TableCell>
              <TableCell className="text-gray-700 text-center">
                {member.province}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 bg-blue-100 border border-blue-200 transition-all duration-300 ease-in-out hover:bg-blue-200 hover:border-blue-300 cursor-pointer"
                    title="แก้ไข"
                    onClick={(e) => handleEditClick(e, member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 bg-red-100 border border-red-200 transition-all duration-300 ease-in-out hover:bg-red-200 hover:border-red-300 cursor-pointer"
                    title="ลบ"
                    onClick={(e) => handleDeleteClick(e, member)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full sm:max-w-2xl [&>button]:size-8 [&>button]:p-2 [&>button]:rounded-full [&>button]:hover:bg-primary/10 [&>button]:hover:text-primary [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:duration-200 [&>button]:transition-colors">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium flex items-center justify-center gap-2 border-b border-gray-200 pb-4">
              <User /> รายละเอียดสมาชิก
            </DialogTitle>
          </DialogHeader>
          <MemberDetailModal member={selectedMember} />
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:size-8 [&>button]:p-2 [&>button]:rounded-full [&>button]:hover:bg-primary/10 [&>button]:hover:text-primary [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:duration-200 [&>button]:transition-colors">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium flex items-center gap-2 border-b border-gray-200 pb-4">
              แก้ไขข้อมูลสมาชิก
            </DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <UpdateMemberForm
              member={selectedMember}
              onSuccess={() => setIsUpdateModalOpen(false)}
              onCancel={() => setIsUpdateModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersTable;
