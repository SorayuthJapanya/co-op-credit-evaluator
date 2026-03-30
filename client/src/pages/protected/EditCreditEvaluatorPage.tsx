import ApplicantForm from "@/components/form/ApplicantForm";
import Header from "@/components/Header";
import { useGetCareerCategories } from "@/hooks/useCareerCategory";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { createEmptyResult } from "@/services/addApplicants";
import { useGetEvaluateById } from "@/hooks/useEvaluate";

const EditCreditEvaluatorPage = () => {
  const { id } = useParams();
  const evaluationId = id || "";
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Get career categories
  const { data: careerCategories, isLoading: careerCategoriesLoading } =
    useGetCareerCategories();
  const { data: evaluateData, isLoading: evaluateDataLoading } =
    useGetEvaluateById(evaluationId);

  // Derive form data from evaluation data
  const formData = useMemo(() => {
    if (evaluateData && evaluationId) {
      const data = evaluateData?.data;
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
  }, [evaluateData, evaluationId]);

  // State for form updates during editing
  const [editedFormData, setEditedFormData] = useState(formData);

  // Sync edited form data when derived data changes
  useEffect(() => {
    setEditedFormData(formData);
  }, [formData]);

  // Show loading state while data is being fetched
  if (evaluateDataLoading || careerCategoriesLoading || !evaluationId) {
    return (
      <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-8">
        <div className="text-gray-600">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

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
          title="แก้ไขเอกสารการประเมิน"
          subTitle="แก้ไขเอกสารการประเมินความสามารถในการชำระหนี้"
        />
      </div>

      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <ApplicantForm
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          numApplicants={(editedFormData.applicants || []).length + 1}
          handleNextStep={handleNextStep}
          handlePreviousStep={handlePreviousStep}
          formData={editedFormData}
          onUpdateFormData={(updatedFormData) =>
            setEditedFormData(updatedFormData)
          }
          isCareerLoading={careerCategoriesLoading}
          careerCategories={careerCategories}
          formType="update"
          updateId={evaluationId}
        />
      </div>
    </div>
  );
};

export default EditCreditEvaluatorPage;
