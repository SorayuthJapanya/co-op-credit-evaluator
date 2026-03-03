import { Users } from "lucide-react";
import InputField from "./InputField";
import type { DebtDetail, ResultEvaluate } from "@/types/evaluate_types";

interface SummarizeDebtProps {
  resultEvaluate: ResultEvaluate;
  onSummarizeChange: (field: keyof DebtDetail, value: number) => void;
}
const SummarizeDebt = ({
  resultEvaluate,
  onSummarizeChange,
}: SummarizeDebtProps) => {
  return (
    <div className="border border-violet-500 rounded-lg">
      <div className="flex items-center justify-start py-4 px-6 bg-violet-50 border-b border-violet-500 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-violet-700" />
          <h2 className="text-lg font-semibold text-violet-700">
            สรุปข้อมูลการชำระหนี้
          </h2>
        </div>
      </div>
      <div className="p-6 space-y-2">
        <h3 className="text-lg font-semibold mb-4 text-violet-700">รวมทุกคน</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="หนี้ครั้งนี้"
            type="number"
            placeholder="0"
            value={resultEvaluate.debtDetail.debtAmount}
            suffix="บาท/เดือน"
            onChange={(value) => onSummarizeChange("debtAmount", Number(value))}
            required
          />
          <InputField
            label="หนี้เดิม GSB (จาก CBS)"
            type="number"
            placeholder="0"
            value={resultEvaluate.debtDetail.lastDebt}
            suffix="บาท/เดือน"
            onChange={(value) => onSummarizeChange("lastDebt", Number(value))}
            required
          />
          <InputField
            label="หนี้สินที่รายงานต่อ NCB (ไม่รวมหนี้เดิม GSB)"
            type="number"
            placeholder="0"
            value={resultEvaluate.debtDetail.debtReported}
            suffix="บาท/เดือน"
            onChange={(value) =>
              onSummarizeChange("debtReported", Number(value))
            }
            required
          />
          <InputField
            label="หนี้สินที่ไม่ได้รายงานต่อ NCB"
            type="number"
            placeholder="0"
            value={resultEvaluate.debtDetail.debtNotReported}
            suffix="บาท/เดือน"
            onChange={(value) =>
              onSummarizeChange("debtNotReported", Number(value))
            }
            required
          />
          <InputField
            label="หัก เงินงวดเดิม กรณีคำขอนี้เป็นการ Refinance"
            type="number"
            placeholder="0"
            value={resultEvaluate.debtDetail.lastDeduction}
            suffix="บาท/เดือน"
            onChange={(value) =>
              onSummarizeChange("lastDeduction", Number(value))
            }
            required
          />
        </div>
        <div className="mt-4 px-3 py-1.5 bg-violet-50 rounded-lg flex items-cent justify-between text-violet-700">
          <p className="font-semibold">DTI (Debt to Income Ratio) </p>
          <p className="text-lg font-semibold">
            {resultEvaluate.dti.toFixed(2)} %
          </p>
        </div>
        <div className="mt-4 px-3 py-1.5 bg-green-50 rounded-lg flex items-cent justify-between text-green-700">
          <p className="font-semibold">DSCR (Debt Service Coverage Ratio)</p>
          <p className="text-lg font-semibold">
            {resultEvaluate.dscr.toFixed(2)} เท่า
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummarizeDebt;
