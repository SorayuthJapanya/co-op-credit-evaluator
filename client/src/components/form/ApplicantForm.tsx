import { User } from "lucide-react";
import { createEmptyApplicant } from "@/services/addApplicants";
import type { ICareerCategory } from "@/types/career_types";
import CareerFormSection from "./CareerFormSection";
import SalaryFormSection from "./SalaryFormSection";
import { Button } from "../ui/button";
import InputField from "./InputField";
import SummaryEvaluateFrom from "./SummaryEvaluateFrom";
import type { ResultEvaluate } from "@/types/evaluate_types";
import Swal from "sweetalert2";
import { useCreateEvaluate, useUpdateEvaluate } from "@/hooks/useEvaluate";
import { useNavigate } from "react-router-dom";

type ApplicantData = ReturnType<typeof createEmptyApplicant>;

interface ApplicantFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  numApplicants: number;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  formData: {
    evaluateType: string;
    marginType: string;
    applicants: ApplicantData[];
    result: ResultEvaluate;
  };
  onUpdateFormData: (data: {
    evaluateType: string;
    marginType: string;
    applicants: ApplicantData[];
    result: ResultEvaluate;
  }) => void;
  isCareerLoading: boolean;
  careerCategories: ICareerCategory[];
  formType?: string;
  updateId: string;
}

const ApplicantForm = ({
  currentStep,
  setCurrentStep,
  numApplicants,
  handleNextStep,
  handlePreviousStep,
  formData,
  onUpdateFormData,
  isCareerLoading,
  careerCategories,
  formType = "add",
  updateId = "",
}: ApplicantFormProps) => {
  const { mutateAsync: createEvaluate, isPending: isCreateEvaluatePending } =
    useCreateEvaluate();
  const { mutateAsync: updateEvaluate, isPending: isUpdating } =
    useUpdateEvaluate();
  const navigate = useNavigate();

  const currentApplicantData =
    formData.applicants[currentStep - 1] || createEmptyApplicant();

  const handleApplicantUpdate = (updatedData: ApplicantData) => {
    const updatedFormData = {
      ...formData,
      applicants: [...formData.applicants],
    };
    updatedFormData.applicants[currentStep - 1] = updatedData;
    onUpdateFormData(updatedFormData);
  };

  const handleResultUpdate = (updatedData: ResultEvaluate) => {
    const updatedFormData = {
      ...formData,
      result: updatedData,
    };
    onUpdateFormData(updatedFormData);
  };

  const handleConfirm = (type: string) => {
    if (type === "" || formType === "") return;

    const updatedFormData = {
      ...formData,
      marginType: type,
    };

    Swal.fire({
      icon: "question",
      title: "ยืนยันการประเมิน",
      text: `คุณต้องการประเมินด้วยเกณฑ์ ${type} หรือไม่?`,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังบันทึกข้อมูล...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        onUpdateFormData(updatedFormData);
        if (formType === "add") {
          await createEvaluate(updatedFormData);
        } else {
          console.log("Updating...")
          await updateEvaluate({ data: updatedFormData, id: updateId });
        }
        Swal.fire({
          icon: "success",
          title: formType === "add" ? "สร้างแบบประเมินสำเร็จ" : "อัพเดตแบบประเมินสำเร็จ",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/credit-evaluator");
      }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Progress Stepper */}
      <div className="mb-6 flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="text-lg font-bold flex items-center text-primary">
          <User className="mr-2 w-5 h-5" />{" "}
          {currentStep === numApplicants
            ? "DTI & DSCR"
            : `ผู้กู้คนที่ ${currentStep} จาก ${numApplicants - 1}`}
        </h2>
        <div className="flex space-x-1">
          {Array.from({ length: numApplicants }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 w-6 rounded-full ${idx < currentStep ? "bg-primary cursor-pointer" : "bg-gray-200 cursor-not-allowed"}`}
              onClick={() => {
                if (idx < currentStep) setCurrentStep(idx + 1);
              }}
            />
          ))}
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {currentStep === numApplicants ? (
          <SummaryEvaluateFrom
            formData={formData}
            onResultUpdate={handleResultUpdate}
            typeForm={formType}
          />
        ) : (
          <>
            <InputField
              label="ประเภทสินเชื่อ"
              type="text"
              placeholder="โปรดระบุ..."
              value={formData.evaluateType}
              onChange={(value) =>
                onUpdateFormData({ ...formData, evaluateType: String(value) })
              }
              required
              className="w-80"
            />
            <CareerFormSection
              applicantData={currentApplicantData}
              onUpdate={handleApplicantUpdate}
              isCareerLoading={isCareerLoading}
              careerCategories={careerCategories}
            />
            <SalaryFormSection
              applicantData={currentApplicantData}
              onUpdate={handleApplicantUpdate}
            />
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={handlePreviousStep}
          disabled={currentStep === 1 || isCreateEvaluatePending || isUpdating}
          variant="outline"
          className="cursor-pointer"
        >
          ย้อนกลับ
        </Button>
        <div className="flex items-center justify-end gap-4">
          {currentStep === numApplicants && (
            <Button
              onClick={() => handleConfirm("DTI & DSCR (ตามเกณฑ์ Margin)")}
              variant="secondary"
              disabled={isCreateEvaluatePending || isUpdating}
              className="cursor-pointer hover:scale-105 active:scale-95 duration-200"
            >
              DTI & DSCR (ตามเกณฑ์ Margin)
            </Button>
          )}
          <Button
            onClick={
              currentStep === numApplicants
                ? () => handleConfirm("DTI & DSCR (ผ่อนปรน Margin)")
                : handleNextStep
            }
            variant="default"
            disabled={isCreateEvaluatePending || isUpdating}
            className="cursor-pointer hover:scale-105 active:scale-95 duration-200"
          >
            {currentStep === numApplicants
              ? "DTI & DSCR (ผ่อนปรน Margin)"
              : "ถัดไป"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantForm;
