import Header from "@/components/Header";
import FormTypeSelector from "@/components/form/FormTypeSelector";
import type { EvaluateFormType } from "@/components/form/FormTypeSelector";
import CareerFormSection from "@/components/form/CareerFormSection";
import SalaryFormSection from "@/components/form/SalaryFormSection";
import SummaryEvaluateFrom from "@/components/form/SummaryEvaluateFrom";
import { Button } from "@/components/ui/button";
import { useGetCareerCategories } from "@/hooks/useCareerCategory";
import { useGetEvaluateById, useUpdateEvaluate } from "@/hooks/useEvaluate";
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Swal from "sweetalert2";
import { createEmptyResult, createEmptyApplicant } from "@/services/addApplicants";
import type { ResultEvaluate, Applicant, Evaluate } from "@/types/evaluate_types";
import type { ICareerCategory } from "@/types/career_types";
import InputField from "@/components/form/InputField";

type ApplicantData = ReturnType<typeof createEmptyApplicant>;

// ─── Stepper UI ───────────────────────────────────────────────────────────────
interface StepperProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const Stepper = ({ currentStep, totalSteps, labels }: StepperProps) => {
  const progressRatio = Math.min(currentStep, totalSteps - 1) / (totalSteps - 1);

  return (
    <div className="bg-card border rounded-xl shadow-sm p-4 sm:p-6">
      <div className="w-full relative px-0.5">
        {/* Background connector line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 z-0" />
        
        {/* Active connector line */}
        <div 
          className="absolute top-5 left-5 h-0.5 bg-primary z-0 transition-all duration-500 ease-in-out"
          style={{ width: `calc((100% - 40px) * ${progressRatio})` }}
        />

        {/* Steps */}
        <div className="flex items-start justify-between relative z-10">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} className="flex flex-col items-center relative w-10">
                {/* Circle */}
                <div
                  className={`
                  w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-300 bg-card
                  ${isDone ? "bg-primary text-white border-none" : "border-2 border-gray-200 text-gray-400"}
                  ${isCurrent ? "bg-primary text-white ring-4 ring-primary/20 border-none" : ""}
                  `}
                >
                  {isDone ? <Check className="h-5 w-5" /> : idx + 1}
                </div>

                {/* Label (Absolutely positioned to maintain spacing math) */}
                <div className="absolute top-12 w-28 sm:w-32 left-1/2 -translate-x-1/2 flex justify-center">
                  <span
                    className={`text-xs sm:text-sm font-medium text-center
                    ${isCurrent ? "text-primary" : isDone ? "text-primary/70" : "text-gray-400"}
                  `}
                  >
                    {labels[idx]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Spacer below to account for perfectly centered absolute labels */}
      <div className="h-6" />
    </div>
  );
};

// ─── Form Content ─────────────────────────────────────────────────────────────
interface EditCreditEvaluatorContentProps {
  evaluationId: string;
  evaluateData: { data: Evaluate } | null;
  careerCategories: ICareerCategory[];
  careerCategoriesLoading: boolean;
}

const EditCreditEvaluatorContent = ({
  evaluationId,
  evaluateData,
  careerCategories,
  careerCategoriesLoading,
}: EditCreditEvaluatorContentProps) => {
  const navigate = useNavigate();
  const { mutateAsync: updateEvaluate, isPending: isUpdating } = useUpdateEvaluate();

  const [globalStep, setGlobalStep] = useState(0); 

  const formDataInitial = useMemo(() => {
    const data = evaluateData?.data;
    if (data) {
      return {
        evaluateType: data.evaluateType || "",
        marginType: data.marginType || "",
        applicants: data.applicants || [],
        result: data.result || createEmptyResult(),
      };
    }
    return {
      evaluateType: "",
      marginType: "",
      applicants: [],
      result: createEmptyResult(),
    };
  }, [evaluateData]);

  const [editedFormData, setEditedFormData] = useState(formDataInitial);

  // Track formTypes per applicant (e.g., "career" or "salary")
  const initialFormTypes = useMemo(() => {
    if (formDataInitial.applicants.length > 0) {
      return formDataInitial.applicants.map((app: Applicant) => {
         if (app.careerCategory || app.career) return "career";
         if (app.salary && Object.values(app.salary).some((val) => Number(val) > 0)) return "salary";
         return "salary"; // Default fallback
      });
    }
    return [];
  }, [formDataInitial]);

  const [formTypes, setFormTypes] = useState<(EvaluateFormType | "")[]>(initialFormTypes);

  const numApplicants = editedFormData.applicants.length;
  if (numApplicants === 0) return null;

  // Step 0 = Applicant 0, Step 1 = Applicant 1, ..., Step N = Summary
  const STEP_LABELS = [
    "ผู้กู้หลัก",
    ...Array.from({ length: Math.max(0, numApplicants - 1) }).map((_, i) => `ผู้กู้ร่วม ${i + 1}`),
    "สรุปผล"
  ];
  const totalSteps = STEP_LABELS.length;

  const currentApplicant = globalStep < numApplicants ? globalStep : 0;
  const currentApplicantData = editedFormData.applicants[currentApplicant] || createEmptyApplicant();
  const currentFormType = formTypes[currentApplicant] ?? "";

  const handleNext = () => {
    if (globalStep < numApplicants) {
       if (!currentFormType) {
         Swal.fire({ icon: "warning", title: "กรุณาเลือกประเภทฟอร์ม" });
         return;
       }
    }

    if (globalStep === numApplicants - 1) {
      // Transitioning to Summary Step -> Ask Margin Type
      Swal.fire({
        title: "เลือกเกณฑ์การประเมิน",
        html: `
          <div class="flex flex-col gap-3 text-left mt-2">
            <label class="flex items-center gap-3 cursor-pointer p-4 border rounded-xl hover:bg-primary/5 transition-colors">
              <input type="radio" name="margin-type" value="DTI & DSCR (ตามเกณฑ์ Margin)" ${editedFormData.marginType === "DTI & DSCR (ตามเกณฑ์ Margin)" ? "checked" : ""} class="w-5 h-5 accent-primary cursor-pointer" />
              <span class="text-sm font-medium">DTI & DSCR (ตามเกณฑ์ Margin)</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer p-4 border rounded-xl hover:bg-primary/5 transition-colors">
              <input type="radio" name="margin-type" value="DTI & DSCR (ผ่อนปรน Margin)" ${editedFormData.marginType === "DTI & DSCR (ผ่อนปรน Margin)" ? "checked" : ""} class="w-5 h-5 accent-primary cursor-pointer" />
              <span class="text-sm font-medium">DTI & DSCR (ผ่อนปรน Margin)</span>
            </label>
          </div>
        `,
        preConfirm: () => {
          const selected = document.querySelector('input[name="margin-type"]:checked') as HTMLInputElement;
          if (!selected) {
            Swal.showValidationMessage("กรุณาเลือกเกณฑ์การประเมิน");
            return false;
          }
          return selected.value;
        },
        showCancelButton: true,
        confirmButtonText: "ดูสรุปผล",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          setEditedFormData({ ...editedFormData, marginType: result.value });
          setGlobalStep(numApplicants); // Go to summary
          setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, 250);
        }
      });
      return;
    }

    setGlobalStep((prev) => Math.min(prev + 1, totalSteps - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setGlobalStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplicantUpdate = (updatedData: ApplicantData) => {
    const updated = { ...editedFormData, applicants: [...editedFormData.applicants] };
    updated.applicants[currentApplicant] = updatedData;
    setEditedFormData(updated);
  };

  const handleResultUpdate = (updatedData: ResultEvaluate) => {
    setEditedFormData((prev) => ({ ...prev, result: updatedData }));
  };

  const handleFormTypeSelect = (type: EvaluateFormType) => {
    const updated = [...formTypes];
    updated[currentApplicant] = type;
    setFormTypes(updated);
  };

  const handleConfirm = async () => {
    Swal.fire({
      icon: "question",
      title: "ยืนยันการอัปเดต",
      text: `คุณต้องการบันทึกการแก้ไขหรือไม่?`,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: "กำลังบันทึกข้อมูล...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        await updateEvaluate({ data: editedFormData, id: evaluationId });
        Swal.fire({ icon: "success", title: "อัปเดตแบบประเมินสำเร็จ", showConfirmButton: false, timer: 2000 });
        navigate("/credit-evaluator");
      }
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4 mb-8">
        <Header
          title="แก้ไขเอกสารการประเมิน"
          subTitle="แก้ไขข้อมูลการประเมินความสามารถในการชำระหนี้"
        />
      </div>

      {/* Stepper */}
      <Stepper
        currentStep={globalStep}
        totalSteps={totalSteps}
        labels={STEP_LABELS}
      />

      <div className="bg-card border rounded-xl shadow-sm p-4 sm:p-6">
        
        {globalStep < numApplicants && (
          <div className="space-y-6">
            {/* Applicant indicator */}
            <div className="mb-6 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                   {currentApplicant + 1}
                 </div>
                 <span className="text-md font-bold text-primary">
                   {currentApplicant === 0 ? "ข้อมูลผู้กู้หลัก" : `ข้อมูลผู้กู้ร่วมคนที่ ${currentApplicant}`}
                 </span>
               </div>
               <span className="text-sm font-semibold px-3 py-1 bg-white rounded-md border text-slate-700">
                  {currentApplicantData?.name}
               </span>
            </div>

            {/* Evaluate Type only on first applicant */}
            {currentApplicant === 0 && (
               <InputField
                  label="ประเภทสินเชื่อ"
                  type="text"
                  placeholder="โปรดระบุ..."
                  value={editedFormData.evaluateType}
                  onChange={(val) => setEditedFormData({ ...editedFormData, evaluateType: String(val) })}
                  required
              />
            )}

            <FormTypeSelector
              selected={currentFormType}
              onChange={handleFormTypeSelect}
            />

            {(currentFormType === "career" || currentFormType === "salary") && (
              <div className="pt-4 border-t">
                 {currentFormType === "career" ? (
                   <CareerFormSection
                     applicantData={currentApplicantData}
                     onUpdate={handleApplicantUpdate}
                     isCareerLoading={careerCategoriesLoading}
                     careerCategories={careerCategories}
                   />
                 ) : (
                   <SalaryFormSection
                     applicantData={currentApplicantData}
                     onUpdate={handleApplicantUpdate}
                   />
                 )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 mt-4">
              <Button variant="outline" onClick={handleBack} disabled={globalStep === 0}>
                ย้อนกลับ
              </Button>
              <Button onClick={handleNext} className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all">
                {globalStep < numApplicants - 1 ? `ถัดไป — ผู้กู้คนที่ ${currentApplicant + 2}` : "ถัดไป — สรุปผล"}
              </Button>
            </div>
          </div>
        )}

        {/* ── Step N: สรุปและยืนยัน ── */}
        {globalStep === numApplicants && (
          <div className="space-y-6">
              <h1 className="text-xl font-semibold mb-6 text-primary">
                 สัดส่วนภาระผ่อนชำระหนี้รวมต่อรายได้สุทธิรวม (DTI) และ สัดส่วนความสามารถในการชำระหนี้ (DSCR)
              </h1>
              
              <SummaryEvaluateFrom
                formData={editedFormData}
                onResultUpdate={handleResultUpdate}
                typeForm="update"
              />

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 sm:mt-8">
              <Button variant="outline" onClick={handleBack}>
                ย้อนกลับ
              </Button>
              <Button
                onClick={handleConfirm}
                variant="default"
                disabled={isUpdating}
                className="cursor-pointer bg-emerald-600 hover:bg-emerald-600/90 transition-all duration-200 px-6"
              >
                บันทึกการแก้ไข
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ─── Main Page Wrapper ─────────────────────────────────────────────────────────
const EditCreditEvaluatorPage = () => {
  const { id } = useParams();
  const evaluationId = id || "";

  const { data: careerCategories, isLoading: careerCategoriesLoading } = useGetCareerCategories();
  const { data: evaluateData, isLoading: evaluateDataLoading } = useGetEvaluateById(evaluationId);

  if (evaluateDataLoading || careerCategoriesLoading || !evaluationId) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8 space-y-8">
        <div className="text-gray-600">กำลังโหลดข้อมูลการประเมิน...</div>
      </div>
    );
  }

  if (!evaluateData) return null;

  return (
    <EditCreditEvaluatorContent
      evaluationId={evaluationId}
      evaluateData={evaluateData}
      careerCategories={careerCategories}
      careerCategoriesLoading={careerCategoriesLoading}
    />
  );
};

export default EditCreditEvaluatorPage;
