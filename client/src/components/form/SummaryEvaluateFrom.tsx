import type { createEmptyApplicant } from "@/services/addApplicants";
import type {
  ResultEvaluate,
  ResultBorrowerData,
  DebtDetail,
} from "@/types/evaluate_types";
import { FileCheckCorner } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import ResultApplicantForm from "./ResultApplicantForm";
import SummarizeDebt from "./SummarizeDebt";

type ApplicantData = ReturnType<typeof createEmptyApplicant>;

interface SummaryEvaluateFromProps {
  formData: {
    evaluateType: string;
    marginType: string;
    applicants: ApplicantData[];
    result: ResultEvaluate;
  };
  onResultUpdate: (updatedData: ResultEvaluate) => void;
  typeForm: string;
}

const SummaryEvaluateFrom = ({
  formData,
  onResultUpdate,
  typeForm = "add",
}: SummaryEvaluateFromProps) => {
  // Calculate initial result data from formData using useMemo
  const initialResultAddData = useMemo((): ResultEvaluate | null => {
    if (!formData) return null;

    // Map applicants to ResultBorrowerData
    const resultApplicants: ResultBorrowerData[] = formData.applicants.map(
      (applicant) => {
        const data = applicant;
        
        // calculate expenses
        const expenses =
          data.salary.tax +
          data.salary.socialSecurityFund +
          data.salary.providentFund +
          data.salary.shareFund +
          data.salary.associationFund +
          data.salary.otherFund;

        // calculate result share value
        const resultShareValue = data.shareHolder.bankNetProfit;

        // calculate total salary
        const totalSalary =
          data.salary.base +
          (data.salary.freelanceIncome || 0) +
          data.otherSalary.total +
          data.optionsSalary.otherDocumentedIncome +
          resultShareValue;

        const resultIncome = totalSalary - expenses;

        const overviewIncome =
          resultIncome < 15000
            ? 0.3
            : resultIncome < 100000
              ? 0.25
              : resultIncome >= 100000
                ? 0.2
                : 0.3;


        const resultCustomerExpenses =
          overviewIncome >= resultIncome * overviewIncome
            ? overviewIncome
            : resultIncome * overviewIncome;

        return {
          name: data.name,
          idCard: data.idCard,
          salary: data.salary.base + data.salary.freelanceIncome,
          expenses: expenses,
          otherSalary: data.otherSalary.total,
          optionsSalary: data.optionsSalary.otherDocumentedIncome,
          resultShareValue: resultShareValue,
          totalSalary: totalSalary,
          resultIncome: resultIncome,
          customerExpenses: overviewIncome,
          resultCustomerExpenses: resultCustomerExpenses,
          livingExpenses: 0,
          otherExpenses: 0,
          totalExpenses: resultCustomerExpenses,
        };
      },
    );

    const debtDetail: DebtDetail = {
      debtAmount: 0,
      lastDebt: 0,
      debtReported: 0,
      debtNotReported: 0,
      lastDeduction: 0,
      totalDebt: 0,
    };

    const dti = 0;
    const dscr = 0;

    return {
      evaluateType: formData.evaluateType,
      applicants: resultApplicants,
      debtDetail,
      dti,
      dscr,
    };
  }, [formData]);

  // Initialize and keep resultFormData in sync with incoming formData
  const [resultFormData, setResultFormData] = useState<ResultEvaluate | null>(null);
  const initializedRef = useRef(false);

  // Sync logic: for `add` flow initialize once; for `update`, prefer provided result
  useEffect(() => {
    if (typeForm === "add") {
      // Only initialize once to avoid resetting user-typed debt values
      if (!initializedRef.current && initialResultAddData) {
        initializedRef.current = true;
        setResultFormData(initialResultAddData);
        onResultUpdate(initialResultAddData);
      }
      return;
    }

    // update flow
    if (formData.result && formData.result.applicants && formData.result.applicants.length > 0) {
      setResultFormData(formData.result);
    } else {
      // if no existing result, compute from applicants as fallback
      setResultFormData(initialResultAddData);
      if (initialResultAddData) onResultUpdate(initialResultAddData);
    }
  }, [formData, initialResultAddData, typeForm, onResultUpdate]);

  // Current result data used by child components
  const currentResultData = resultFormData || initialResultAddData || formData.result;

  if (!formData) return null;

  const handleApplicantChange = (
    applicantIndex: number,
    field: keyof ResultBorrowerData,
    value: number,
  ) => {
    if (!currentResultData) return;

    setResultFormData((prevData) => {
      const baseData = prevData || currentResultData;
      const updatedApplicants = [...baseData.applicants];
      const currentApplicant = { ...updatedApplicants[applicantIndex] };

      // Update the specific field
      const updatedApplicant = {
        ...currentApplicant,
        [field]: value,
      } as ResultBorrowerData;

      const livingExpenses = Number(updatedApplicant.livingExpenses);
      const otherExpenses = Number(updatedApplicant.otherExpenses);
      const resultTotalExpenses =
        Number(updatedApplicant.resultCustomerExpenses) + livingExpenses + otherExpenses;

      // Update calculated values
      const finalApplicant = {
        ...updatedApplicant,
        totalExpenses: resultTotalExpenses,
      };

      updatedApplicants[applicantIndex] = finalApplicant;

      const updatedResultData = {
        ...baseData,
        applicants: updatedApplicants,
      };

      // Call parent's onResultUpdate to sync data
      onResultUpdate(updatedResultData);

      return updatedResultData;
    });
  };

  const handleSummarizeChange = (filed: keyof DebtDetail, value: number) => {
    if (!currentResultData) return;

    setResultFormData((prev) => {
      const baseData = prev || currentResultData;
      const updatedDebt = {
        ...baseData.debtDetail,
        [filed]: value,
      } as DebtDetail;

      const totalDebt =
        updatedDebt.debtAmount +
        updatedDebt.lastDebt +
        updatedDebt.debtReported +
        updatedDebt.debtNotReported;

      const updatedDebtWithTotal = {
        ...updatedDebt,
        totalDebt,
      };

      const totalApplicantsSalary = baseData.applicants.reduce(
        (acc, cur) => acc + cur.totalSalary,
        0,
      );

      const totalApplicantsResultIncome = baseData.applicants.reduce(
        (acc, cur) => acc + cur.resultIncome,
        0,
      );
      const totalApplicantsResultExpenses = baseData.applicants.reduce(
        (acc, cur) => acc + cur.totalExpenses,
        0,
      );

      // Prevent division by zero
      const dti = totalApplicantsSalary > 0 
        ? ((totalDebt / totalApplicantsSalary) * 100).toFixed(2)
        : "0.00";
      const dscr = totalDebt > 0
        ? (
            (totalApplicantsResultIncome - totalApplicantsResultExpenses) /
            totalDebt
          ).toFixed(2)
        : "0.00";

      const updatedResult = {
        ...baseData,
        debtDetail: updatedDebtWithTotal,
        dti: parseFloat(dti),
        dscr: parseFloat(dscr),
      };

      onResultUpdate(updatedResult);

      return updatedResult;
    });
  };
  return (
    <div className="space-y-6">
      <div className="border border-primary/50 rounded-lg">
        <div className="flex items-center justify-start py-4 px-6 bg-primary/5 border-b border-primary/50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <FileCheckCorner className="size-5 text-primary/80" />
            <h2 className="text-lg font-semibold text-primary">
              ประเภทสินเชื่อ: {formData.evaluateType}
            </h2>
          </div>
        </div>
        <div className="p-6 space-y-2">
          <h3 className="text-lg font-semibold mb-4 text-primary">
            ข้อมูลผู้กู้และผู้กู้ร่วม
          </h3>
          {formData.applicants.map((applicant, idx) => (
            <div
              key={applicant.idCard}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b pb-2 last:border-b-0 last:pb-0 sm:border-b-0 sm:pb-0"
            >
              <div>
                {idx === 0 ? (
                  <p>
                    ผู้กู้:{" "}
                    <span className="font-medium">{applicant.name || ""}</span>
                  </p>
                ) : (
                  <p>
                    ผู้กู้ร่วม (คนที่ {idx}):{" "}
                    <span className="font-medium">{applicant.name || ""}</span>
                  </p>
                )}
              </div>
              <p>
                เลขบัตรประชาชน:{" "}
                <span className="font-medium">{applicant.idCard}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Result Applicant Form */}
      {currentResultData && (
        <ResultApplicantForm
          applicants={currentResultData.applicants}
          onApplicantChange={handleApplicantChange}
        />
      )}

      {/* Summarize Debt */}
      {currentResultData && (
        <SummarizeDebt
          resultEvaluate={currentResultData}
          onSummarizeChange={handleSummarizeChange}
        />
      )}
    </div>
  );
};

export default SummaryEvaluateFrom;
