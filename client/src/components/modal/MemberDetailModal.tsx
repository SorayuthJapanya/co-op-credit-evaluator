import type { IMember } from "@/types/member_types";
import { formatDateToThai } from "@/utils";

interface MemberDetailModalProps {
  member: IMember | null;
}

const MemberDetailModal = ({ member }: MemberDetailModalProps) => {
  if (!member) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      <div className="space-y-1">
        <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
          <span className="text-gray-800 group-hover:text-primary/80">รหัสสมาชิก:</span>
          <span className="font-medium col-span-2">{member.memberId}</span>
        </div>
        <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
          <span className="text-gray-800 group-hover:text-primary/80">เลขบัตรประชาชน:</span>
          <span className="font-medium col-span-2">{member.idCard}</span>
        </div>
        <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
          <span className="text-gray-800 group-hover:text-primary/80">ชื่อ-สกุล:</span>
          <span className="font-medium col-span-2">{member.fullName}</span>
        </div>
        <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
          <span className="text-gray-800 group-hover:text-primary/80">สัญชาติ:</span>
          <span className="font-medium col-span-2">{member.nationality || "-"}</span>
        </div>
        <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
          <span className="text-gray-800 group-hover:text-primary/80">วันที่เข้าร่วม:</span>
          <span className="font-medium col-span-2">
            {formatDateToThai(member.joiningDate || "")}
          </span>
        </div>
        {Number(member.sharesValue) === 0 && (
          <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
            <span className="text-gray-800 group-hover:text-primary/80">วันที่ลาออก:</span>
            <span className="font-medium col-span-2">
              {member.leavingDate ? formatDateToThai(member.leavingDate) : "-"}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
          <span className="text-gray-800 group-hover:text-primary/80">ปีบัญชี:</span>
          <span className="font-medium col-span-2">{Number(member.accountYear) + 543 || "-"}</span>
        </div>
        <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
          <span className="text-gray-800 group-hover:text-primary/80">ประเภทสมาชิก:</span>
          <span className="font-medium col-span-2">{member.memberType}</span>
        </div>
        <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
          <span className="text-gray-800 group-hover:text-primary/80">จำนวนหุ้น:</span>
          <span className="font-medium col-span-2">
            {member.sharesNum?.toLocaleString() || "0"} หุ้น
          </span>
        </div>
        <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
          <span className="text-gray-800 group-hover:text-primary/80">มูลค่าหุ้น:</span>
          <span className="font-medium col-span-2 text-green-600">
            ฿ {member.sharesValue?.toLocaleString() || "0"}
          </span>
        </div>
      </div>

      <div className="sm:col-span-2 mt-4">
        <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">
          ที่อยู่
        </h3>
        <div className="grid sm:grid-cols-2 gap-1">
          <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
            <span className="text-gray-800 group-hover:text-primary/80">บ้านเลขที่:</span>
            <span className="font-medium col-span-2">{member.address || "-"}</span>
          </div>
          <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
            <span className="text-gray-800 group-hover:text-primary/80">หมู่:</span>
            <span className="font-medium col-span-2">{member.moo || "-"}</span>
          </div>
          <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
            <span className="text-gray-800 group-hover:text-primary/80">ตำบล:</span>
            <span className="font-medium col-span-2">{member.subdistrict || "-"}</span>
          </div>
          <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
            <span className="text-gray-800 group-hover:text-primary/80">อำเภอ:</span>
            <span className="font-medium col-span-2">{member.district || "-"}</span>
          </div>
          <div className="group grid grid-cols-3 p-2 hover:bg-primary/5 duration-100 rounded-md">
            <span className="text-gray-800 group-hover:text-primary/80">จังหวัด:</span>
            <span className="font-medium col-span-2">{member.province || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
