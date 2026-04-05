import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { IMember } from "@/types/member_types";
import {
  User,
  CreditCard,
  Hash,
  TrendingUp,
  Banknote,
  MapPin,
  RefreshCcw,
} from "lucide-react";

interface MemberInfoCardProps {
  member: IMember;
  applicantIndex: number;
  totalApplicants: number;
  onChangeMember?: () => void;
}

const MemberInfoCard = ({
  member,
  applicantIndex,
  totalApplicants,
  onChangeMember,
}: MemberInfoCardProps) => {
  const formatAddress = (m: IMember) => {
    const parts = [
      m.address,
      m.moo ? `หมู่ ${m.moo}` : "",
      m.subdistrict ? `ต.${m.subdistrict}` : "",
      m.district ? `อ.${m.district}` : "",
      m.province ? `จ.${m.province}` : "",
    ].filter(Boolean);
    return parts.join(" ");
  };

  const infoItems = [
    {
      icon: User,
      label: "ชื่อ-นามสกุล",
      value: member.fullName,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: CreditCard,
      label: "เลขบัตรประชาชน",
      value: member.idCard,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: Hash,
      label: "รหัสสมาชิก",
      value: member.memberId,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      icon: TrendingUp,
      label: "จำนวนหุ้น",
      value: `${member.sharesNum?.toLocaleString("th-TH")} หุ้น`,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Banknote,
      label: "มูลค่าหุ้น",
      value: `${member.sharesValue?.toLocaleString("th-TH")} บาท`,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: MapPin,
      label: "ที่อยู่",
      value: formatAddress(member),
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <Card className="border-primary/20 shadow-sm overflow-hidden gap-0 py-0">
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-6 bg-primary/5 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
            {applicantIndex + 1}
          </div>
          <h3 className="text-base font-semibold text-primary">
            {applicantIndex === 0
              ? "ข้อมูลผู้กู้หลัก"
              : `ข้อมูลผู้กู้ร่วมคนที่ ${applicantIndex}`}
            <span className="text-xs font-normal text-muted-foreground ml-2">
              ({applicantIndex + 1}/{totalApplicants})
            </span>
          </h3>
        </div>
        {onChangeMember && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onChangeMember}
            className="gap-1.5 text-xs"
          >
            <RefreshCcw className="h-3 w-3" />
            เปลี่ยนสมาชิก
          </Button>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {infoItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-3">
                <div
                  className={`shrink-0 w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center`}
                >
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium truncate">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberInfoCard;
