import { createEmptyApplicant } from "@/services/addApplicants";
import InputField from "./InputField";
import { HandCoins } from "lucide-react";
import type { BorrowerData } from "@/types/evaluate_types";

type ApplicantData = ReturnType<typeof createEmptyApplicant>;

interface SalaryFormSectionProps {
  applicantData: ApplicantData;
  onUpdate: (data: ApplicantData) => void;
}

const SalaryFormSection = ({
  applicantData,
  onUpdate,
}: SalaryFormSectionProps) => {
  const recalculateDerivedValues = (data: BorrowerData): BorrowerData => {
    const newData = {
      ...data,
      salary: { ...data.salary },
      otherSalary: { ...data.otherSalary },
      optionsSalary: { ...data.optionsSalary },
    };

    const totalSalary = calculateTotalSalary(newData);
    const totalOtherSalary = calculateOtherSalary(newData);
    const totalOptionsSalary = calculateOptionsSalary(newData);

    newData.salary.total = totalSalary;
    newData.otherSalary.total = totalOtherSalary;
    newData.optionsSalary.otherDocumentedIncome = totalOptionsSalary;
    newData.optionsSalary.total =
      totalSalary + totalOtherSalary + totalOptionsSalary;
    return newData;
  };

  const handleNestedFieldChange = (
    parent: keyof BorrowerData,
    field: string,
    value: string | number,
  ) => {
    const currentParent = applicantData[parent] || {};
    let newBorrowerData = {
      ...applicantData,
      [parent]: {
        ...currentParent,
        [field]: value,
      },
    };
    newBorrowerData = recalculateDerivedValues(newBorrowerData);
    onUpdate(newBorrowerData);
  };

  const calculateTotalSalary = (data: BorrowerData) => {
    const salary = data.salary;
    const result =
      salary.base -
      (salary.tax +
        salary.socialSecurityFund +
        salary.providentFund +
        salary.shareFund +
        salary.associationFund +
        salary.otherFund);
    return result || 0;
  };

  const calculateOtherSalary = (data: BorrowerData) => {
    const otherSalary = data.otherSalary;
    const result =
      otherSalary.entertainmentSalary +
      otherSalary.livingSalary +
      otherSalary.certificationSalary +
      otherSalary.professionalAllowance +
      otherSalary.transportationSalary +
      otherSalary.academicSalary +
      otherSalary.otherRegularSalary;
    return result || 0;
  };

  const calculateOptionsSalary = (data: BorrowerData) => {
    const optionSalary = data.optionsSalary;
    const result =
      optionSalary.commission +
      optionSalary.overtime +
      optionSalary.bonus +
      optionSalary.dividendsInterest +
      optionSalary.netSupplementaryIncome +
      optionSalary.other +
      optionSalary.otherDocumentedIncome;
    return result || 0;
  };

  const resultTotalSalary = (data: BorrowerData) => {
    const totalSalary = calculateTotalSalary(data);
    const otherSalary = calculateOtherSalary(data);
    const optionsSalary = calculateOptionsSalary(data);
    return totalSalary + otherSalary + optionsSalary;
  };

  return (
    <div className="space-y-6">
      {/* ค่าใช้จ่าย Section */}
      <div className="border border-orange-400 rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-start py-4 px-6 bg-orange-50  border-b border-orange-400 rounded-t-lg">
          <div className="flex items-center gap-2">
            <HandCoins className="size-5 text-orange-700/80" />
            <h2 className="text-lg font-semibold text-orange-700">
              รายได้จากเงินเดือน
            </h2>
          </div>
        </div>
        <div className="p-6 space-y-6 pb-6 border-b">
          <h3 className="text-lg font-semibold mb-4 text-orange-700">
            (1) รายได้สุทธิจากเงินเดือน
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="อัตราเงินเดือน"
              type="number"
              placeholder="0"
              value={applicantData.salary.base}
              onChange={(value) =>
                handleNestedFieldChange("salary", "base", value)
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="ภาษี (หัก)"
              type="number"
              placeholder="0"
              value={applicantData.salary.tax}
              onChange={(value) =>
                handleNestedFieldChange("salary", "tax", value)
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="ค่าประกันสังคม (หัก)"
              type="number"
              placeholder="0"
              value={applicantData.salary.socialSecurityFund}
              onChange={(value) =>
                handleNestedFieldChange("salary", "socialSecurityFund", value)
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="กองทุนสำรองเลี้ยงชีพ (หัก)"
              type="number"
              placeholder="0"
              value={applicantData.salary.providentFund}
              onChange={(value) =>
                handleNestedFieldChange("salary", "providentFund", value)
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="ค่าหุ้นสหกรณ์ (หัก)"
              type="number"
              placeholder="0"
              value={applicantData.salary.shareFund}
              onChange={(value) =>
                handleNestedFieldChange("salary", "shareFund", value)
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="ฌอส. (หัก)"
              type="number"
              placeholder="0"
              value={applicantData.salary.associationFund}
              onChange={(value) =>
                handleNestedFieldChange("salary", "associationFund", value)
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="อื่นๆ (หัก)"
              type="number"
              placeholder="0"
              value={applicantData.salary.otherFund}
              onChange={(value) =>
                handleNestedFieldChange("salary", "otherFund", value)
              }
              suffix="บาท/เดือน"
            />
          </div>
          <div className="mt-4 px-3 py-1.5 bg-orange-50 rounded-lg flex items-cent justify-between text-orange-700">
            <p className="font-semibold">รวมรายได้สุทธิจากเงินเดือน</p>
            <p className="text-lg font-semibold">
              {resultTotalSalary(applicantData).toLocaleString(
                "th-TH",
              )}{" "}
              บาท/เดือน
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6 pb-6 border-b">
          <h3 className="text-lg font-semibold mb-4 text-orange-700">
            (2) เงินได้ประจำอื่นๆ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="เงินประจำตำแหน่ง"
              type="number"
              placeholder="0"
              value={applicantData.otherSalary.entertainmentSalary}
              onChange={(value) =>
                handleNestedFieldChange(
                  "otherSalary",
                  "entertainmentSalary",
                  value,
                )
              }
              suffix="%"
            />

            <InputField
              label="เงินเบิกค่าเช่าบ้าน"
              type="number"
              placeholder="0"
              value={applicantData.otherSalary.livingSalary}
              onChange={(value) =>
                handleNestedFieldChange("otherSalary", "livingSalary", value)
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="ค่ารับรอง"
              type="number"
              placeholder="0"
              value={applicantData.otherSalary.certificationSalary}
              onChange={(value) =>
                handleNestedFieldChange(
                  "otherSalary",
                  "certificationSalary",
                  value,
                )
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="ค่าครองชีพ/ค่าอาหาร/ค่าช่วยเหลือบุตร"
              type="number"
              placeholder="0"
              value={applicantData.otherSalary.professionalAllowance}
              onChange={(value) =>
                handleNestedFieldChange(
                  "otherSalary",
                  "professionalAllowance",
                  value,
                )
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="ค่าพาหนะ/ค่าน้ำมัน"
              type="number"
              placeholder="0"
              value={applicantData.otherSalary.transportationSalary}
              onChange={(value) =>
                handleNestedFieldChange(
                  "otherSalary",
                  "transportationSalary",
                  value,
                )
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="ค่าวิชาชีพ/วิทยฐานะ"
              type="number"
              placeholder="0"
              value={applicantData.otherSalary.academicSalary}
              onChange={(value) =>
                handleNestedFieldChange("otherSalary", "academicSalary", value)
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="อื่นๆ"
              type="number"
              placeholder="0"
              value={applicantData.otherSalary.otherRegularSalary}
              onChange={(value) =>
                handleNestedFieldChange(
                  "otherSalary",
                  "otherRegularSalary",
                  value,
                )
              }
              suffix="บาท/เดือน"
            />
          </div>
          <div className="mt-4 px-3 py-1.5 bg-orange-50 rounded-lg flex items-cent justify-between text-orange-700">
            <p className="font-semibold">รวมเงินได้ประจำอื่นๆ</p>
            <p className="text-lg font-semibold">
              {calculateOtherSalary(applicantData).toLocaleString(
                "th-TH",
              )}{" "}
              บาท/เดือน
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6 pb-6 border-b">
          <h3 className="text-lg font-semibold mb-4 text-orange-700">
            (3) เงินได้อื่นๆ ที่มีหลักฐาน
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="ค่า Commission"
              type="number"
              placeholder="0"
              value={applicantData.optionsSalary.commission}
              onChange={(value) =>
                handleNestedFieldChange("optionsSalary", "commission", value)
              }
              suffix="%"
            />

            <InputField
              label="ค่า OT/ค่าเบี้ยขยัน"
              type="number"
              placeholder="0"
              value={applicantData.optionsSalary.overtime}
              onChange={(value) =>
                handleNestedFieldChange("optionsSalary", "overtime", value)
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="โบนัส"
              type="number"
              placeholder="0"
              value={applicantData.optionsSalary.bonus}
              onChange={(value) =>
                handleNestedFieldChange("optionsSalary", "bonus", value)
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="เงินปันผล/ดอกเบี้ยรับ"
              type="number"
              placeholder="0"
              value={applicantData.optionsSalary.dividendsInterest}
              onChange={(value) =>
                handleNestedFieldChange(
                  "optionsSalary",
                  "dividendsInterest",
                  value,
                )
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="รายได้เสริมสุทธิ (ไม่มีต้นทุน)"
              type="number"
              placeholder="0"
              value={
                applicantData.optionsSalary.netSupplementaryIncome
              }
              onChange={(value) =>
                handleNestedFieldChange(
                  "optionsSalary",
                  "netSupplementaryIncome",
                  value,
                )
              }
              suffix="บาท/เดือน"
            />

            <InputField
              label="อื่นๆ"
              type="number"
              placeholder="0"
              value={applicantData.optionsSalary.other}
              onChange={(value) =>
                handleNestedFieldChange("optionsSalary", "other", value)
              }
              suffix="บาท/เดือน"
            />
          </div>
          <div className="mt-4 px-3 py-1.5 bg-orange-50 rounded-lg flex items-cent justify-between text-orange-700">
            <p className="font-semibold">รวมเงินได้อื่นๆ ที่มีหลักฐาน</p>
            <p className="text-lg font-semibold">
              {calculateOptionsSalary(applicantData).toLocaleString(
                "th-TH",
              )}{" "}
              บาท/เดือน
            </p>
          </div>
          <div className="mt-4 px-3 py-1.5 bg-orange-100 rounded-lg flex items-cent justify-between text-orange-700">
            <p className="font-semibold">รายได้จากเงินเดือน</p>
            <p className="text-lg font-semibold">
              {resultTotalSalary(applicantData).toLocaleString(
                "th-TH",
              )}{" "}
              บาท/เดือน
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryFormSection;
