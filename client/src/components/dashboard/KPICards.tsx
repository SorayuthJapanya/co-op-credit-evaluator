import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  UserPlus,
  TrendingUp,
  BarChart2,
  UserMinus,
} from "lucide-react";
import type { IDashboardOverview } from "@/types/dash_types";
import { CountUp } from "../CountUp";

interface kpiCardsProps {
  data: IDashboardOverview;
  selectedYear: string;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const formatNumber = (num: number) => num.toLocaleString("th-TH");

const formatCurrency = (amount: number) =>
  amount.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

// ─── sub-components ──────────────────────────────────────────────────────────

/**
 * แถบสีบางๆ ด้านบนการ์ด + icon circle
 * รับ variant เพื่อเลือกชุดสี
 */
type Variant = "blue" | "green" | "purple" | "red";

const variantStyles: Record<
  Variant,
  {
    bar: string; // gradient บนสุด
    iconWrap: string; // วงกลมหลัง icon
    icon: string; // สี icon
    valueText: string; // สีตัวเลขหลัก
    badgeBg: string; // พื้น badge
    badgeText: string; // ตัวอักษร badge
  }
> = {
  blue: {
    bar: "from-blue-500 to-blue-400",
    iconWrap: "bg-blue-50",
    icon: "text-blue-600",
    valueText: "text-blue-700",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600",
  },
  green: {
    bar: "from-emerald-500 to-teal-400",
    iconWrap: "bg-emerald-50",
    icon: "text-emerald-600",
    valueText: "text-emerald-700",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-600",
  },
  purple: {
    bar: "from-violet-500 to-purple-400",
    iconWrap: "bg-violet-50",
    icon: "text-violet-600",
    valueText: "text-violet-700",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-600",
  },
  red: {
    bar: "from-rose-500 to-red-400",
    iconWrap: "bg-rose-50",
    icon: "text-rose-600",
    valueText: "text-rose-700",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-600",
  },
};

// ─── main component ───────────────────────────────────────────────────────────

export const KPICards: React.FC<kpiCardsProps> = ({ data, selectedYear }) => {
  const { memberChange } = data.kpi?.membersThisYear || { memberChange: 0 };

  // สมาชิกใหม่ — variant ขึ้นอยู่กับค่า change
  const newMemberVariant: Variant =
    memberChange > 0 ? "green" : memberChange < 0 ? "red" : "blue";

  const cards: {
    variant: Variant;
    icon: React.ElementType;
    title: string;
    rawValue: number;
    suffix: string
    subtitle: string;
    badge?: React.ReactNode;
  }[] = [
    {
      variant: "blue",
      icon: Users,
      title: "สมาชิกทั้งหมด",
      rawValue: data.kpi?.totalMembers || 0,
      suffix: " คน",
      subtitle: `ปีบัญชี ${selectedYear}`,
    },
    {
      variant: "green",
      icon: TrendingUp,
      title: "จำนวนหุ้นรวม",
      rawValue: data.kpi?.totalShares || 0,
      suffix: " หุ้น",
      subtitle: `มูลค่ารวม ${formatCurrency((data.kpi?.totalShares || 0) * 10)}`,
    },
    {
      variant: "purple",
      icon: BarChart2,
      title: "หุ้นเฉลี่ย / คน",
      rawValue: data.kpi?.averageSharesPerPerson || 0,
      suffix: " หุ้น",
      subtitle: `มูลค่าเฉลี่ย ${formatCurrency((data.kpi?.averageSharesPerPerson || 0) * 10)}`,
    },
    {
      variant: newMemberVariant,
      icon: memberChange >= 0 ? UserPlus : UserMinus,
      title: "สมาชิกใหม่ปีนี้",
      rawValue: data.kpi?.membersThisYear?.currentCount || 0,
      suffix: " คน",
      subtitle: `เปรียบเทียบปีก่อน ${formatNumber(data.kpi?.membersThisYear?.lastYearCount || 0)} คน`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const s = variantStyles[card.variant];
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white gap-0 py-4 hover:scale-105"
          >
            {/* ── แถบ gradient บนสุด ── */}
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${s.bar}`}
            />

            <CardContent>
              {/* ── แถวบน: หัวข้อ + icon ── */}
              <div className="flex items-start justify-between">
                <p className="font-medium text-gray-700 leading-tight">
                  {card.title}
                </p>
                <div className={`flex-shrink-0 rounded-xl p-2.5 ${s.iconWrap}`}>
                  <Icon className={`h-5 w-5 ${s.icon}`} />
                </div>
              </div>

              {/* ── ตัวเลขหลัก ── */}
              <CountUp
                to={card.rawValue}
                suffix={card.suffix}
                duration={1.4}
                className={`text-3xl font-bold tracking-tight mb-0.5 ${s.valueText}`}
              />

              {/* ── subtitle ── */}
              <p className="text-xs text-gray-400 mb-3">{card.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
