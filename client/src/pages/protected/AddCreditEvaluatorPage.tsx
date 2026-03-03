import ApplicantForm from "@/components/form/ApplicantForm";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCareerCategories } from "@/hooks/useCareerCategory";
import {
  createEmptyApplicant,
  createEmptyResult,
} from "@/services/addApplicants";
import type { ResultEvaluate } from "@/types/evaluate_types";
import { useState } from "react";

type ApplicantData = ReturnType<typeof createEmptyApplicant>;

const AddCreditEvaluatorPage = () => {
  const [selectedApplicants, setSelectedApplicants] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<{
    evaluateType: string;
    marginType: string;
    applicants: ApplicantData[];
    result: ResultEvaluate;
  }>({
    evaluateType: "",
    marginType: "",
    applicants: [], // array of applicants
    result: createEmptyResult(),
  });

  // Get career categories
  const { data: careerCategories, isLoading: careerCategoriesLoading } =
    useGetCareerCategories();

  const handleStartProcess = () => {
    if (selectedApplicants === "") return;

    const applicants = Array.from(
      { length: parseInt(selectedApplicants) - 1 || 0 },
      () => createEmptyApplicant(),
    );
    // Use sample data for testing - replace with empty applicants if needed
    // const applicants = createSampleApplicants(
    //   parseInt(selectedApplicants) - 1 || 0,
    // );

    setFormData((prev) => ({
      ...prev,
      applicants,
    }));
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-8">
      <div className="w-full flex flex-col md:flex-row items-center gap-4 sm:justify-between mb-8">
        <Header
          title="สร้างเอกสารการประเมิน"
          subTitle="สร้างเอกสารการประเมินความสามารถในการชำระหนี้"
        />

        <div className="w-full flex items-center justify-center sm:justify-start md:justify-end gap-3">
          <label className="truncate">จำนวนผู้กู้ (คน)</label>
          <Select
            value={selectedApplicants}
            onValueChange={setSelectedApplicants}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกจำนวนผู้กู้" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>จำนวนผู้กู้</SelectLabel>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={(num + 1).toString()}>
                    {num} คน
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            size="lg"
            className="cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
            onClick={handleStartProcess}
          >
            สร้างแบบฟอร์ม
          </Button>
        </div>
      </div>

      {currentStep > 0 && (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <ApplicantForm
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            numApplicants={parseInt(selectedApplicants)}
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            formData={formData}
            onUpdateFormData={(updatedFormData) => setFormData(updatedFormData)}
            isCareerLoading={careerCategoriesLoading}
            careerCategories={careerCategories}
            formType="add"
            updateId=""
          />
        </div>
      )}
    </div>
  );
};

export default AddCreditEvaluatorPage;
