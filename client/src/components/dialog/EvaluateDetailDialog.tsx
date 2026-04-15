import {
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertCircle,
} from "lucide-react";
import type { Evaluate } from "@/types/evaluate_types";
import { Button } from "@/components/ui/button";
import { formatDateToThai } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EvaluateDetailDialogProps {
  evaluate: Evaluate | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (e: React.MouseEvent, evaluate: Evaluate) => void;
}

const statusConfig = {
  อนุมัติ: {
    icon: CheckCircle2,
    bg: "bg-green-50",
    border: "border-green-200",
    iconColor: "text-green-500",
    textColor: "text-green-800",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700",
    label: "อนุมัติ",
  },
  ไม่อนุมัติ: {
    icon: XCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    iconColor: "text-red-500",
    textColor: "text-red-800",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    label: "ไม่อนุมัติ",
  },
  รอการอนุมัติ: {
    icon: Clock,
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconColor: "text-amber-500",
    textColor: "text-amber-800",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    label: "รอการอนุมัติ",
  },
};

const EvaluateDetailDialog = ({
  evaluate,
  isOpen,
  onOpenChange,
  onExport,
}: EvaluateDetailDialogProps) => {
  const status =
    (evaluate?.status as keyof typeof statusConfig) || "รอการอนุมัติ";
  const cfg = statusConfig[status] ?? statusConfig["รอการอนุมัติ"];
  const StatusIcon = cfg.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-4xl max-h-[85vh] overflow-y-auto [&>button]:hidden">
        {/* ── Header ── */}
        <DialogHeader>
          <DialogTitle asChild>
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    รายละเอียดการประเมินสินเชื่อ
                  </p>
                  <p className="text-sm font-normal text-gray-500 mt-0.5">
                    วันที่ประเมิน:{" "}
                    {evaluate?.createdAt
                      ? formatDateToThai(evaluate.createdAt)
                      : "—"}
                  </p>
                </div>
              </div>
              {evaluate && (
                <Button
                  variant="ghost"
                  size="sm"
                  title="ส่งออก PDF"
                  onClick={(e) => onExport(e, evaluate)}
                  className="shrink-0 h-9 px-4 text-indigo-600 hover:text-indigo-700 bg-indigo-100 border border-indigo-200 hover:bg-indigo-200 hover:border-indigo-300 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  <span className="text-sm font-medium">ส่งออก PDF</span>
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {evaluate && (
          <div className="space-y-6 py-4">
            {/* ── ผลการอนุมัติ Banner ── */}
            <div
              className={`flex items-start gap-4 p-5 rounded-2xl border-2 ${cfg.bg} ${cfg.border}`}
            >
              <div className={`mt-0.5 shrink-0 ${cfg.iconColor}`}>
                <StatusIcon className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
                  ผลการอนุมัติ
                </p>
                <p className={`text-2xl font-bold ${cfg.textColor}`}>
                  {cfg.label}
                </p>
                {evaluate.feedback && (
                  <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-medium text-gray-500">
                        หมายเหตุ:{" "}
                      </span>
                      {evaluate.feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Highlight Metrics ── */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                ตัวชี้วัดสำคัญ
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* DTI */}
                <div className="flex flex-col gap-1 p-4 bg-blue-50 border border-blue-500 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                      DTI
                    </span>
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800 leading-none">
                    {evaluate.result.dti.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">เท่า</p>
                </div>

                {/* DSCR */}
                <div className="flex flex-col gap-1 p-4 bg-emerald-50 border border-emerald-500 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                      DSCR
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800 leading-none">
                    {evaluate.result.dscr.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">%</p>
                </div>

                {/* รายได้สุทธิประเมิน */}
                <div className="flex flex-col gap-1 p-4 bg-green-50 border border-green-500 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-green-500">
                      รายได้สุทธิประเมิน
                    </span>
                    <Wallet className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-xl font-bold text-gray-800 leading-none">
                    ฿{" "}
                    {evaluate.result.applicants
                      .reduce((t, a) => t + a.resultIncome, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    บาท / เดือน
                  </p>
                </div>

                {/* ภาระหนี้รวม */}
                <div className="flex flex-col gap-1 p-4 bg-red-50 border border-red-500 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                      ภาระหนี้รวม
                    </span>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  </div>
                  <p className="text-xl font-bold text-gray-800 leading-none">
                    ฿ {evaluate.result.debtDetail.totalDebt.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    บาท / เดือน
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: ข้อมูลผู้สมัคร และ อาชีพ */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                ประเภทสินเชื่อ: {evaluate.evaluateType} ({evaluate.marginType})
              </h3>
              {evaluate.applicants.map((applicant, index) => (
                <div key={index} className="my-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    ผู้สมัครที่ {index + 1}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ชื่อผู้กู้
                      </label>
                      <p className="text-gray-900 font-medium mt-1">
                        {applicant.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        เลขบัตรประชาชน
                      </label>
                      <p className="text-gray-900 font-medium mt-1">
                        {applicant.idCard}
                      </p>
                    </div>
                    {applicant.careerCategory && applicant.career && (
                      <>
                        <div className="sm:col-span-2">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            หมวดหมู่อาชีพ
                          </label>
                          <p className="text-gray-900 mt-1">
                            {applicant.careerCategory}
                          </p>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            อาชีพหลัก
                          </label>
                          <p className="text-gray-900 mt-1">
                            {applicant.career}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Section 3: รายละเอียดทางการเงิน */}
            <div className="space-y-6">
              {evaluate.result.applicants.map((applicant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 sm:pb-8 border-b border-gray-200 last:border-b-0 last:pb-0"
                >
                  <div className="lg:col-span-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      ข้อมูลทางการเงิน - ผู้สมัครที่ {index + 1}
                    </h3>
                  </div>

                  {/* Column Left: ฝั่งรายได้ */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900 border-b pb-2">
                      โครงสร้างรายได้
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm py-1">
                        <span className="text-gray-600">อัตราเงินเดือน</span>
                        <span className="font-medium text-gray-900">
                          ฿ {applicant.totalSalary.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm py-1">
                        <span className="text-gray-600">เงินได้ประจำอื่นๆ</span>
                        <span className="font-medium text-gray-900">
                          ฿ {applicant.otherSalary.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm py-1">
                        <span className="text-gray-600">
                          เงินได้อื่นๆ ที่มีหลักฐาน
                        </span>
                        <span className="font-medium text-gray-900">
                          ฿ {applicant.optionsSalary.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm py-1">
                        <span className="text-gray-60 max-w-72">
                          กำไรสุทธิจากการประกอบอาชีพตามสัดส่วนการถือหุ้นในธุรกิจ
                        </span>
                        <span className="font-medium text-gray-900">
                          ฿ {applicant.resultShareValue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-sm font-semibold text-gray-900">
                          รวมรายได้ประเมิน (Total Salary)
                        </span>
                        <span className="font-semibold text-gray-900">
                          ฿ {applicant.totalSalary.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Column Right: ฝั่งภาระหนี้และค่าใช้จ่าย */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900 border-b pb-2">
                      ภาระหนี้สินและค่าใช้จ่าย
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm py-1">
                        <span className="text-gray-600">
                          รายการหักของหน่วยงานที่ไม่ใช่ภาระหนี้
                        </span>
                        <span className="font-medium text-red-600">
                          ฿ {applicant.expenses.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm py-1">
                        <span className="text-gray-600">
                          ค่าใช้จ่ายในการอุปโภคบริโภค
                        </span>
                        <span className="font-medium text-red-600">
                          ฿ {applicant.resultCustomerExpenses.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm py-1">
                        <span className="text-gray-600">
                          ค่าใช้จ่ายที่พักอาศัย
                        </span>
                        <span className="font-medium text-red-600">
                          ฿ {applicant.livingExpenses.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm py-1">
                        <span className="text-gray-600">ค่าใช่จ่ายอื่นๆ</span>
                        <span className="font-medium text-red-600">
                          ฿ {applicant.otherExpenses.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-sm font-semibold text-gray-900">
                          ค่าใช้จ่ายรวม
                        </span>
                        <span className="font-semibold text-red-600">
                          ฿ {applicant.totalExpenses.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EvaluateDetailDialog;
