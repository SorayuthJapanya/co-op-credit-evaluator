import { useAuthContext } from "@/hooks/useAuthContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CountUp } from "@/components/CountUp";
import { getPublicKPI } from "@/services/publicService";
import {
  Users,
  FileCheck,
  TrendingUp,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  Lock,
} from "lucide-react";

// ─── variant styles matching KPICards.tsx ─────────────────────────────────────
type Variant = "blue" | "green" | "purple";

const variantStyles: Record<
  Variant,
  {
    bar: string;
    iconWrap: string;
    icon: string;
    valueText: string;
    border: string;
  }
> = {
  blue: {
    bar: "from-blue-500 to-blue-400",
    iconWrap: "bg-blue-50",
    icon: "text-blue-600",
    valueText: "text-blue-700",
    border: "border-blue-100",
  },
  green: {
    bar: "from-emerald-500 to-teal-400",
    iconWrap: "bg-emerald-50",
    icon: "text-emerald-600",
    valueText: "text-emerald-700",
    border: "border-emerald-100",
  },
  purple: {
    bar: "from-violet-500 to-purple-400",
    iconWrap: "bg-violet-50",
    icon: "text-violet-600",
    valueText: "text-violet-700",
    border: "border-violet-100",
  },
};

// ─── component ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { authUser, isLoading: authLoading } = useAuthContext();

  const { data: kpi, isLoading: kpiLoading } = useQuery({
    queryKey: ["public-kpi"],
    queryFn: getPublicKPI,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const kpiCards: {
    variant: Variant;
    icon: React.ElementType;
    title: string;
    value: number;
    suffix: string;
    subtitle: string;
  }[] = [
    {
      variant: "blue",
      icon: Users,
      title: "สมาชิกทั้งหมด",
      value: kpi?.totalMembers ?? 0,
      suffix: " คน",
      subtitle: "จำนวนสมาชิกสหกรณ์ในระบบ",
    },
    {
      variant: "green",
      icon: TrendingUp,
      title: "จำนวนหุ้นรวม",
      value: kpi?.totalShares ?? 0,
      suffix: " หุ้น",
      subtitle: "มูลค่าหุ้นทั้งหมดของสมาชิก",
    },
    {
      variant: "purple",
      icon: FileCheck,
      title: "จำนวนการประเมิน",
      value: kpi?.totalEvaluations ?? 0,
      suffix: " รายการ",
      subtitle: "ใบประเมินสินเชื่อทั้งหมด",
    },
  ];

  const steps = [
    {
      icon: Lock,
      color: "text-blue-600",
      shadow: "shadow-blue-100",
      title: "เข้าสู่ระบบ",
      desc: "เจ้าหน้าที่สหกรณ์เข้าสู่ระบบด้วยรหัสบัตรประชาชน 13 หลักเพื่อเริ่มใช้งาน",
    },
    {
      icon: ClipboardList,
      color: "text-indigo-600",
      shadow: "shadow-indigo-100",
      title: "กรอกฟอร์มประเมิน",
      desc: "สร้างใบประเมินใหม่ ระบุข้อมูลผู้กู้ รายได้ รายจ่าย และเพิ่มผู้กู้ร่วมได้",
    },
    {
      icon: CheckCircle2,
      color: "text-emerald-600",
      shadow: "shadow-emerald-100",
      title: "รับผลวิเคราะห์ทันที",
      desc: "ระบบคำนวณเปอร์เซ็นต์ภาระหนี้ พร้อมสรุปผลว่าผ่านเกณฑ์หรือไม่",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 w-full border-b bg-sidebar backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo + brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/credit-evaluator-icon.png"
              alt="credit-evaluator-icon"
              className="w-14 h-auto group-hover:scale-110 transition-transform duration-300"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold truncate">
                สหกรณ์เครดิตยูเนี่ยน
              </span>
              <span className="text-xs font-medium text-muted-foreground truncate">
                สันกว๊าน จำกัด
              </span>
            </div>
          </Link>

          {/* Auth button */}
          <nav>
            {authLoading ? (
              <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
            ) : authUser ? (
              <Link to="/dashboard">
                <Button className="gap-2 shadow-sm">
                  แดชบอร์ด
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="gap-2 shadow-sm">
                  เข้าสู่ระบบ
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              ระบบประเมินความสามารถในการชำระหนี้
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              วิเคราะห์ความสามารถ
              <br />
              <span className="text-primary">ในการชำระหนี้อย่างแม่นยำ</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              แพลตฟอร์มสำหรับประเมินศักยภาพผู้ขอสินเชื่อ
              รองรับผู้กู้ร่วมและสร้างรายงานผลคำนวณภาระหนี้อัตโนมัติ
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {authUser ? (
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    เริ่มใช้งานแดชบอร์ด
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button
                    size="lg"
                    className="gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    เข้าสู่ระบบเพื่อเริ่มต้น
                    <Lock className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* KPI Section — real data */}
        <section className="border-y bg-sidebar py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                ภาพรวมสถิติของระบบ
              </h2>
              <p className="mt-2 text-muted-foreground">
                ข้อมูลสถิติจริงจากฐานข้อมูลของสหกรณ์
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kpiCards.map((card) => {
                const s = variantStyles[card.variant];
                const Icon = card.icon;

                return (
                  <Card
                    key={card.title}
                    className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-card gap-0 py-4 hover:scale-[1.03]"
                  >
                    {/* gradient bar top */}
                    <div
                      className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${s.bar}`}
                    />

                    <CardContent>
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-muted-foreground leading-tight">
                          {card.title}
                        </p>
                        <div
                          className={`shrink-0 rounded-xl p-2.5 ${s.iconWrap} border ${s.border}`}
                        >
                          <Icon className={`h-5 w-5 ${s.icon}`} />
                        </div>
                      </div>

                      {kpiLoading ? (
                        <div className="mt-2 h-8 w-32 animate-pulse rounded bg-muted" />
                      ) : (
                        <CountUp
                          to={card.value}
                          suffix={card.suffix}
                          duration={1.4}
                          className={`text-3xl font-bold tracking-tight mb-0.5 ${s.valueText}`}
                        />
                      )}

                      <p className="text-xs text-muted-foreground/70">
                        {card.subtitle}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How to use */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                วิธีการใช้งานระบบ
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                เริ่มต้นประเมินความสามารถในการชำระหนี้ง่ายๆ ใน 3 ขั้นตอน
              </p>
            </div>

            <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
              {/* Connector line (desktop) */}
              <div className="pointer-events-none absolute top-10 left-[15%] right-[15%] hidden h-px bg-border md:block" />

              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    className="relative z-10 flex flex-col items-center text-center"
                  >
                    <div
                      className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border bg-card shadow-lg ${step.shadow} hover:-translate-y-1 transition-transform duration-300`}
                    >
                      <Icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold">
                      {i + 1}. {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t bg-sidebar py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Credit Evaluator System. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
