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
import { useState } from "react";

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
  const [marginType, setMarginType] = useState<string>("");

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

  const handleClearApplicant = () => {
    Swal.fire({
      icon: "warning",
      title: "ยืนยันการล้างข้อมูล",
      text: `คุณต้องการล้างข้อมูลของผู้กู้คนที่ ${currentStep} หรือไม่?`,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        handleApplicantUpdate(createEmptyApplicant());
      }
    });
  };

  const handleConfirm = () => {
    if (marginType === "" || formType === "") return;

    const updatedFormData = {
      ...formData,
      marginType,
    };

    Swal.fire({
      icon: "question",
      title: "ยืนยันการประเมิน",
      text: `คุณต้องการประเมินด้วยเกณฑ์ ${marginType} หรือไม่?`,
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
          await updateEvaluate({ data: updatedFormData, id: updateId });
        }
        Swal.fire({
          icon: "success",
          title:
            formType === "add"
              ? "สร้างแบบประเมินสำเร็จ"
              : "อัพเดตแบบประเมินสำเร็จ",
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
            ? marginType
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
        <div className="flex gap-4">
          <Button
            onClick={handlePreviousStep}
            disabled={
              currentStep === 1 || isCreateEvaluatePending || isUpdating
            }
            variant="outline"
            className="cursor-pointer"
          >
            ย้อนกลับ
          </Button>
          {currentStep !== numApplicants && (
            <Button
              onClick={handleClearApplicant}
              disabled={isCreateEvaluatePending || isUpdating}
              variant="outline"
              className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
            >
              ล้างข้อมูล
            </Button>
          )}
        </div>
        <div className="flex items-center justify-end gap-4">
          {currentStep === numApplicants - 1 && (
            <Button
              onClick={() => {
                setMarginType("DTI & DSCR (ตามเกณฑ์ Margin)");
                handleNextStep();
              }}
              variant="default"
              disabled={isCreateEvaluatePending || isUpdating}
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-600/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              DTI & DSCR (ตามเกณฑ์ Margin)
            </Button>
          )}
          <Button
            onClick={
              currentStep === numApplicants - 1
                ? () => {
                    setMarginType("DTI & DSCR (ผ่อนปรน Margin)");
                    handleNextStep();
                  }
                : currentStep === numApplicants
                  ? handleConfirm
                  : handleNextStep
            }
            variant="default"
            disabled={isCreateEvaluatePending || isUpdating}
            className="cursor-pointer hover:scale-105 active:scale-95 duration-200"
          >
            {currentStep === numApplicants - 1
              ? "DTI & DSCR (ผ่อนปรน Margin)"
              : currentStep === numApplicants
                ? "ยืนยันการประเมิน"
                : "ถัดไป"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantForm;
