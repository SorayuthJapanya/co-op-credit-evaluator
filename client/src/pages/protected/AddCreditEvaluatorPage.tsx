import Header from "@/components/Header";
import MemberSearchSelect from "@/components/form/MemberSearchSelect";
import MemberInfoCard from "@/components/form/MemberInfoCard";
import FormTypeSelector from "@/components/form/FormTypeSelector";
import type { EvaluateFormType } from "@/components/form/FormTypeSelector";
import CareerFormSection from "@/components/form/CareerFormSection";
import SalaryFormSection from "@/components/form/SalaryFormSection";
import SummaryEvaluateFrom from "@/components/form/SummaryEvaluateFrom";
import InputField from "@/components/form/InputField";
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
import type { IMember } from "@/types/member_types";
import type { ResultEvaluate } from "@/types/evaluate_types";
import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import Swal from "sweetalert2";
import { useCreateEvaluate } from "@/hooks/useEvaluate";
import { useNavigate } from "react-router-dom";

type ApplicantData = ReturnType<typeof createEmptyApplicant>;

// ─── Stepper Steps Definition ─────────────────────────────────────────────────
const STEP_LABELS = [
  "จำนวนผู้กู้",
  "เลือกสมาชิก",
  "ข้อมูลสมาชิก",
  "เลือกฟอร์ม",
  "กรอกฟอร์ม",
  "สรุป",
];

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

// ─── Main Page ────────────────────────────────────────────────────────────────
const AddCreditEvaluatorPage = () => {
  // Step 0: Select applicant count
  const [numApplicants, setNumApplicants] = useState<string>("");
  const [isCountLocked, setIsCountLocked] = useState(false);

  // Step 1: Global step index (0-based)
  const [globalStep, setGlobalStep] = useState(0);

  // Per-applicant data
  const [selectedMembers, setSelectedMembers] = useState<(IMember | null)[]>(
    [],
  );
  const [formTypes, setFormTypes] = useState<(EvaluateFormType | "")[]>([]);
  const [currentApplicant, setCurrentApplicant] = useState(0);

  // Evaluate type (ประเภทสินเชื่อ)
  const [evaluateType, setEvaluateType] = useState("");

  // Form data
  const [formData, setFormData] = useState<{
    evaluateType: string;
    marginType: string;
    applicants: ApplicantData[];
    result: ResultEvaluate;
  }>({
    evaluateType: "",
    marginType: "",
    applicants: [],
    result: createEmptyResult(),
  });

  const { data: careerCategories, isLoading: careerCategoriesLoading } =
    useGetCareerCategories();
  const { mutateAsync: createEvaluate, isPending: isCreatePending } =
    useCreateEvaluate();
  const navigate = useNavigate();

  // Margin type state
  const [marginType, setMarginType] = useState("");

  // ─── Derived values ───────────────────────────────────────────────────
  const numCount = parseInt(numApplicants) || 0;
  const totalSteps = STEP_LABELS.length;

  // ─── Step 0: Lock applicant count ─────────────────────────────────────
  const handleLockCount = () => {
    if (!numApplicants || numCount < 1) return;
    if (!evaluateType.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกประเภทสินเชื่อ",
      });
      return;
    }

    const applicants = Array.from({ length: numCount }, () =>
      createEmptyApplicant(),
    );

    setFormData({
      evaluateType,
      marginType: "",
      applicants,
      result: createEmptyResult(),
    });
    setSelectedMembers(Array(numCount).fill(null));
    setFormTypes(Array(numCount).fill(""));
    setCurrentApplicant(0);
    setIsCountLocked(true);
    setGlobalStep(1); // Go to "เลือกสมาชิก"
  };

  const handleReset = () => {
    Swal.fire({
      icon: "warning",
      title: "เริ่มใหม่?",
      text: "ข้อมูลทั้งหมดจะถูกล้าง",
      showCancelButton: true,
      confirmButtonText: "เริ่มใหม่",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        setNumApplicants("");
        setIsCountLocked(false);
        setGlobalStep(0);
        setSelectedMembers([]);
        setFormTypes([]);
        setCurrentApplicant(0);
        setEvaluateType("");
        setMarginType("");
        setFormData({
          evaluateType: "",
          marginType: "",
          applicants: [],
          result: createEmptyResult(),
        });
      }
    });
  };

  // ─── Step 1: Member selected ──────────────────────────────────────────
  const handleMemberSelect = (member: IMember) => {
    const updated = [...selectedMembers];
    updated[currentApplicant] = member;
    setSelectedMembers(updated);

    // Also fill name + idCard into formData
    const updatedFormData = {
      ...formData,
      applicants: [...formData.applicants],
    };
    updatedFormData.applicants[currentApplicant] = {
      ...updatedFormData.applicants[currentApplicant],
      name: member.fullName,
      idCard: member.idCard,
    };
    setFormData(updatedFormData);

    setGlobalStep(2); // Go to "ข้อมูลสมาชิก"
  };

  const handleChangeMember = () => {
    const updated = [...selectedMembers];
    updated[currentApplicant] = null;
    setSelectedMembers(updated);
    setGlobalStep(1); // Back to search
  };

  // ─── Step 3: Form type selected ───────────────────────────────────────
  const handleFormTypeSelect = (type: EvaluateFormType) => {
    const updated = [...formTypes];
    updated[currentApplicant] = type;
    setFormTypes(updated);
  };

  // ─── Applicant data update handler ────────────────────────────────────
  const handleApplicantUpdate = (updatedData: ApplicantData) => {
    const updatedFormData = {
      ...formData,
      applicants: [...formData.applicants],
    };
    updatedFormData.applicants[currentApplicant] = updatedData;
    setFormData(updatedFormData);
  };

  // ─── Navigation ───────────────────────────────────────────────────────
  const handleNext = () => {
    if (globalStep === 3 && !formTypes[currentApplicant]) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกประเภทฟอร์ม",
      });
      return;
    }

    if (globalStep === 4) {
      // After filling form for current applicant
      if (currentApplicant < numCount - 1) {
        // More applicants to go — loop back to step 1
        setCurrentApplicant((prev) => prev + 1);
        setGlobalStep(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      // All applicants done — ask for margin type before summary
      Swal.fire({
        title: "เลือกเกณฑ์การประเมิน",
        html: `
          <div class="flex flex-col gap-3 text-left mt-2">
            <label class="flex items-center gap-3 cursor-pointer p-4 border rounded-xl hover:bg-primary/5 transition-colors">
              <input type="radio" name="margin-type" value="DTI & DSCR (ตามเกณฑ์ Margin)" class="w-5 h-5 accent-primary cursor-pointer" />
              <span class="text-sm font-medium">DTI & DSCR (ตามเกณฑ์ Margin)</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer p-4 border rounded-xl hover:bg-primary/5 transition-colors">
              <input type="radio" name="margin-type" value="DTI & DSCR (ผ่อนปรน Margin)" class="w-5 h-5 accent-primary cursor-pointer" />
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
          setMarginType(result.value);
          setGlobalStep(5);
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 250);
        }
      });
      return;
    }

    setGlobalStep((prev) => Math.min(prev + 1, totalSteps - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (globalStep === 1 && currentApplicant > 0) {
      // Go back to previous applicant's form step
      setCurrentApplicant((prev) => prev - 1);
      setGlobalStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setGlobalStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Submit ───────────────────────────────────────────────────────────
  const handleConfirm = (selectedMarginType: string) => {
    if (!selectedMarginType) return;

    const updatedFormData = {
      ...formData,
      marginType: selectedMarginType,
    };

    Swal.fire({
      icon: "question",
      title: "ยืนยันการประเมิน",
      text: `คุณต้องการประเมินด้วยเกณฑ์ ${selectedMarginType} หรือไม่?`,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังบันทึกข้อมูล...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
        setFormData(updatedFormData);
        await createEvaluate(updatedFormData);
        Swal.fire({
          icon: "success",
          title: "สร้างแบบประเมินสำเร็จ",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/credit-evaluator");
      }
    });
  };

  const handleResultUpdate = (updatedData: ResultEvaluate) => {
    setFormData((prev) => ({ ...prev, result: updatedData }));
  };

  // Currently-selected member for current applicant
  const currentMember = selectedMembers[currentApplicant] ?? null;
  const currentFormType = formTypes[currentApplicant] ?? "";
  const currentApplicantData =
    formData.applicants[currentApplicant] || createEmptyApplicant();

  // Excluded IDs — already selected by other applicant slots
  const excludeIds = selectedMembers
    .filter((m, i) => m && i !== currentApplicant)
    .map((m) => m!.id);

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-6xl p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4 mb-8">
        <Header
          title="สร้างเอกสารการประเมิน"
          subTitle="สร้างเอกสารการประเมินความสามารถในการชำระหนี้"
        />
        {isCountLocked && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
          >
            <RotateCcw className="h-4 w-4" />
            เริ่มใหม่
          </Button>
        )}
      </div>

      {/* Stepper */}
      {isCountLocked && (
        <Stepper
          currentStep={globalStep}
          totalSteps={totalSteps}
          labels={STEP_LABELS}
        />
      )}

      <div className="bg-card border rounded-xl shadow-sm p-4 sm:p-6">
      {/* Applicant indicator */}
      {isCountLocked && globalStep >= 1 && globalStep <= 4 && numCount > 1 && (
        <div className="mb-6 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-lg flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
            {currentApplicant + 1}
          </div>
          <span className="text-sm font-medium text-primary">
            {currentApplicant === 0
              ? "ผู้กู้หลัก"
              : `ผู้กู้ร่วมคนที่ ${currentApplicant}`}
            <span className="text-muted-foreground ml-1">
              ({currentApplicant + 1}/{numCount})
            </span>
          </span>
        </div>
      )}

      {/* ── Step 0: เลือกจำนวนผู้กู้ ── */}
      {globalStep === 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-6">
            เริ่มต้นสร้างเอกสารประเมิน
          </h2>

          <div className="space-y-6">
            <InputField
              label="ประเภทสินเชื่อ"
              type="text"
              placeholder="โปรดระบุ..."
              value={evaluateType}
              onChange={(val) => setEvaluateType(String(val))}
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">
                จำนวนผู้กู้ (คน) <span className="text-destructive">*</span>
              </label>
              <Select
                value={numApplicants}
                onValueChange={setNumApplicants}
                disabled={isCountLocked}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกจำนวนผู้กู้" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>จำนวนผู้กู้</SelectLabel>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} คน
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              size="lg"
              className="w-full cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              onClick={handleLockCount}
              disabled={!numApplicants || !evaluateType.trim()}
            >
              ถัดไป
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 1: เลือกสมาชิก ── */}
      {globalStep === 1 && (
        <div>
          <MemberSearchSelect
            onSelect={handleMemberSelect}
            excludeIds={excludeIds}
            label={
              currentApplicant === 0
                ? "ค้นหาผู้กู้หลัก"
                : `ค้นหาผู้กู้ร่วมคนที่ ${currentApplicant}`
            }
          />
        </div>
      )}

      {/* ── Step 2: ข้อมูลสมาชิก ── */}
      {globalStep === 2 && currentMember && (
        <div className="space-y-6">
          <MemberInfoCard
            member={currentMember}
            applicantIndex={currentApplicant}
            totalApplicants={numCount}
            onChangeMember={handleChangeMember}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              ถัดไป — เลือกประเภทฟอร์ม
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: เลือกประเภทฟอร์ม ── */}
      {globalStep === 3 && (
        <div>
          <FormTypeSelector
            selected={currentFormType}
            onChange={handleFormTypeSelect}
          />

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack}>
              ย้อนกลับ
            </Button>
            <Button
              onClick={handleNext}
              disabled={!currentFormType}
              className="cursor-pointer"
            >
              ถัดไป — กรอกฟอร์ม
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 4: กรอกฟอร์ม ── */}
      {globalStep === 4 && (
        <div className="space-y-6">
          {/* Show member info recap */}
          {currentMember && (
            <MemberInfoCard
              member={currentMember}
              applicantIndex={currentApplicant}
              totalApplicants={numCount}
            />
          )}

          {/* Form section */}
          <>
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
          </>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              ย้อนกลับ
            </Button>
            <Button
              onClick={handleNext}
              className="cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {currentApplicant < numCount - 1
                ? `ถัดไป — ผู้กู้คนที่ ${currentApplicant + 2}`
                : "ถัดไป — สรุปผล"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 5: สรุปและยืนยัน ── */}
      {globalStep === 5 && (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold mb-6 text-primary">สัดส่วนภาระผ่อนชำระหนี้รวมต่อรายได้สุทธิรวม (DTI) และ สัดส่วนความสามารถในการชำระหนี้ (DSCR)</h1>
            <SummaryEvaluateFrom
              formData={formData}
              onResultUpdate={handleResultUpdate}
              typeForm="add"
            />

          {/* Margin type selection + Submit */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 sm:mt-8">
            <Button variant="outline" onClick={handleBack}>
              ย้อนกลับ
            </Button>
            <Button
              onClick={() => handleConfirm(marginType)}
              variant="default"
              disabled={isCreatePending}
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-600/90 transition-all duration-200 px-6"
            >
              บันทึกการประเมิน
            </Button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AddCreditEvaluatorPage;
