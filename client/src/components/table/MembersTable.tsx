import { Edit, Trash2 } from "lucide-react";
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

interface MembersTableProps {
  members: IMember[];
}

const MembersTable = ({ members }: MembersTableProps) => {
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
            <TableRow key={member.id} className="group">
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
                {formatDateToThai(member.joiningDate)}
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
              <TableCell>
                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    title="แก้ไข"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="ลบ"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersTable;
