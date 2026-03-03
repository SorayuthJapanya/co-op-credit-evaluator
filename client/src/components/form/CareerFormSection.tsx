import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEmptyApplicant } from "@/services/addApplicants";
import type { ICareerCategory, ISubCareer } from "@/types/career_types";
import type { BorrowerData } from "@/types/evaluate_types";
import { Briefcase } from "lucide-react";
import InputField from "./InputField";

type ApplicantData = ReturnType<typeof createEmptyApplicant>;

interface CareerFormSectionProps {
  applicantData: ApplicantData;
  onUpdate: (data: ApplicantData) => void;
  isCareerLoading: boolean;
  careerCategories: ICareerCategory[];
}

const CareerFormSection = ({
  applicantData,
  onUpdate,
  isCareerLoading,
  careerCategories,
}: CareerFormSectionProps) => {
  const getCareerMargin = (categoryName: string, subCategoryName: string) => {
    if (!categoryName || !careerCategories) return 0;
    const category = careerCategories.find(
      (cat: ICareerCategory) => cat.categoryName === categoryName,
    );
    const subCategory = category?.subCategory.find(
      (subCat: ISubCareer) => subCat.subCategoryName === subCategoryName,
    );
    return subCategory?.subNetProfit || 0;
  };

  const recalculateDerivedValues = (data: ApplicantData): BorrowerData => {
    // Deep clone the parts we might mutate
    const newData = {
      ...data,
      businessActivity: { ...data.businessActivity },
      expenseItem: { ...data.expenseItem },
      profileLost: { ...data.profileLost },
      shareHolder: { ...data.shareHolder },
    };

    const totalSal =
      Number(newData.businessActivity.salary || 0) +
      Number(newData.businessActivity.otherSalary || 0);

    newData.businessActivity.totalIncome = totalSal;

    const costPercentage = Number(newData.expenseItem.costPercentage || 0);
    const costAndService = totalSal * (costPercentage / 100);
    newData.expenseItem.costAndService = costAndService;

    const sumExpense =
      costAndService +
      Number(newData.expenseItem.empSalary || 0) +
      Number(newData.expenseItem.rentExpenses || 0) +
      Number(newData.expenseItem.utilityExpenses || 0) +
      Number(newData.expenseItem.otherExpenses || 0);

    newData.expenseItem.totalExpense = sumExpense;

    const grossProfit = totalSal - sumExpense;
    newData.profileLost.grossProfit = grossProfit;

    const profitBeforeTax =
      grossProfit - Number(newData.profileLost.interestExpense || 0);
    newData.profileLost.profitBeforeTax = profitBeforeTax;

    const netProfit =
      profitBeforeTax - Number(newData.profileLost.taxExpense || 0);
    newData.profileLost.netProfit = netProfit;

    const shareProfitPercentage = Number(
      newData.shareHolder.shareOfNetProfit || 0,
    );
    const shareValue = netProfit * (shareProfitPercentage / 100);
    newData.shareHolder.bankNetProfit = Number(shareValue.toFixed(2));

    const careerMargin = getCareerMargin(
      newData.careerCategory,
      newData.career,
    );
    const lastProfit =
      totalSal * (careerMargin / 100) * (shareProfitPercentage / 100);

    let optionalOtherExpense = shareValue - lastProfit;
    if (optionalOtherExpense <= 0) optionalOtherExpense = 0;
    newData.optionalOtherExpense = Number(optionalOtherExpense.toFixed(2));

    return newData;
  };

  const handleFieldChange = (
    field: keyof BorrowerData,
    value: string | number,
  ) => {
    let newBorrowerData = {
      ...applicantData,
      [field]: value,
    };
    newBorrowerData = recalculateDerivedValues(newBorrowerData);
    onUpdate(newBorrowerData);
  };

  const handleNestedFieldChange = (
    parent: keyof BorrowerData,
    field: string,
    value: string | number,
  ) => {
    const currentParent = (applicantData[parent]) || {};
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

  const handleCategoryChange = (categoryName: string) => {
    let newBorrowerData = {
      ...applicantData,
      careerCategory: categoryName,
      career: "",
    };
    newBorrowerData = recalculateDerivedValues(newBorrowerData);
    onUpdate(newBorrowerData);
  };

  const handleCareerChange = (careerName: string) => {
    let newBorrowerData = {
      ...applicantData,
      career: careerName,
    };
    newBorrowerData = recalculateDerivedValues(newBorrowerData);
    onUpdate(newBorrowerData);
  };

  const getCurrentSubCategories = () => {
    if (!applicantData.careerCategory || !careerCategories)
      return [];
    const category = careerCategories.find(
      (cat: ICareerCategory) =>
        cat.categoryName === applicantData.careerCategory,
    );
    return category?.subCategory || [];
  };

  const bData = applicantData;

  const currentCareerMargin = getCareerMargin(
    bData.careerCategory,
    bData.career,
  );

  const calculateLastProfit = () => {
    const totalSal =
      Number(bData.businessActivity.salary || 0) +
      Number(bData.businessActivity.otherSalary || 0);
    const shareProfitPercentage = Number(
      bData.shareHolder.shareOfNetProfit || 0,
    );
    return (
      totalSal * (currentCareerMargin / 100) * (shareProfitPercentage / 100)
    );
  };

  const formatNumber = (val: number | string | undefined | null) => {
    return Number(val || 0).toLocaleString("th-TH");
  };

  return (
    <div className="space-y-6">
      <div className="border border-primary/50 rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-start py-4 px-6 bg-primary/5 border-b border-primary/50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Briefcase className="size-5 text-primary/80" />
            <h2 className="text-lg font-semibold text-primary">
              กำไรสุทธิ/ขาดทุนสุทธิจากการประกอบอาชีพตามสัดส่วนการถือหุ้นในธุรกิจ
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ข้อมูลส่วนตัว Section */}
          <h3 className="text-lg font-semibold mb-4 text-primary">
            ข้อมูลส่วนตัว
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b">
            <InputField
              label="ชื่อผู้กู้"
              type="text"
              placeholder="ชื่อ-สกุล"
              value={bData.name}
              onChange={(value) => handleFieldChange("name", value)}
              required
            />
            <InputField
              label="เลขบัตรประชาชน"
              type="text"
              placeholder="เลขบัตรประชาชน"
              value={bData.idCard}
              onChange={(value) => handleFieldChange("idCard", value)}
              required
            />
          </div>
          {/* อาชีพ Section */}
          <h3 className="text-lg font-semibold mb-4 text-primary">อาชีพ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-6 border-b">
            <div className="space-y-2">
              <Label>
                เลือกหมวดหมู่ <span className="text-destructive">*</span>
              </Label>
              <Select
                value={bData.careerCategory}
                onValueChange={handleCategoryChange}
                disabled={isCareerLoading}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup>
                    {careerCategories.map((category: ICareerCategory) => (
                      <SelectItem
                        key={category.categoryName}
                        value={category.categoryName}
                      >
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                เลือกอาชีพ <span className="text-destructive">*</span>
              </Label>
              <Select
                value={bData.career}
                onValueChange={handleCareerChange}
                disabled={!bData.careerCategory || isCareerLoading}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="กรุณาเลือกหมวดหมู่ก่อน" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectGroup>
                    {getCurrentSubCategories().map(
                      (subCategory: ISubCareer) => (
                        <SelectItem
                          key={subCategory.subCategoryName}
                          value={subCategory.subCategoryName}
                        >
                          {subCategory.subCategoryName}
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <InputField
                label="อื่นๆ โปรดระบุ"
                type="text"
                placeholder="โปรดระบุ..."
                value={bData.otherCareer}
                onChange={(value) => handleFieldChange("otherCareer", value)}
              />
            </div>
          </div>

          {/* รายได้ของกิจการ/อาชีพอิสระ Section */}
          <div className="space-y-6 pb-6 border-b">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              (1) รายได้ของกิจการ/อาชีพอิสระ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="รายได้ (บาท/เดือน)"
                type="number"
                placeholder="0"
                value={bData.businessActivity.salary}
                onChange={(value) =>
                  handleNestedFieldChange("businessActivity", "salary", value)
                }
                required
              />
              <InputField
                label="รายได้อื่นๆ จากธุรกิจ (บาท/เดือน)"
                type="number"
                placeholder="0"
                value={bData.businessActivity.otherSalary}
                onChange={(value) =>
                  handleNestedFieldChange(
                    "businessActivity",
                    "otherSalary",
                    value,
                  )
                }
                required
              />
            </div>
            <div className="mt-4 px-3 py-1.5 bg-primary/5 rounded-lg flex items-cent justify-between text-primary">
              <p className="font-semibold">รวมรายได้ของกิจการ/อาชีพอิสระ</p>
              <p className="text-lg font-semibold">
                {formatNumber(bData.businessActivity.totalIncome)} บาท/เดือน
              </p>
            </div>
          </div>

          {/* ค่าใช้จ่าย Section */}
          <div className="space-y-6 pb-6 border-b">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              (2) ค่าใช้จ่าย
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="ค่าใช้จ่ายซื้อสินค้าและบริการ (เปอร์เซ็นต์)"
                type="number"
                placeholder="0"
                value={bData.expenseItem.costPercentage}
                onChange={(value) =>
                  handleNestedFieldChange(
                    "expenseItem",
                    "costPercentage",
                    value,
                  )
                }
                required
              />

              <InputField
                label="ค่าใช้จ่ายซื้อสินค้าและบริการ (บาท/เดือน)"
                type="number"
                placeholder="0"
                value={bData.expenseItem.costAndService}
                onChange={(value) =>
                  handleNestedFieldChange(
                    "expenseItem",
                    "costAndService",
                    value,
                  )
                }
                required
                readOnly
              />

              <InputField
                label="เงินเดือนคนงาน (บาท/เดือน)"
                type="number"
                placeholder="0"
                value={bData.expenseItem.empSalary}
                onChange={(value) =>
                  handleNestedFieldChange("expenseItem", "empSalary", value)
                }
                required
              />

              <InputField
                label="ค่าเช่า (บาท/เดือน)"
                type="number"
                placeholder="0"
                value={bData.expenseItem.rentExpenses}
                onChange={(value) =>
                  handleNestedFieldChange("expenseItem", "rentExpenses", value)
                }
                required
              />

              <InputField
                label="ค่าน้ำ ค่าไฟ ค่าโทรศัพท์ (บาท/เดือน)"
                type="number"
                placeholder="0"
                value={bData.expenseItem.utilityExpenses}
                onChange={(value) =>
                  handleNestedFieldChange(
                    "expenseItem",
                    "utilityExpenses",
                    value,
                  )
                }
                required
              />

              <InputField
                label="ค่าใช้จ่ายอื่นๆ (บาท/เดือน)"
                type="number"
                placeholder="0"
                value={bData.expenseItem.otherExpenses}
                onChange={(value) =>
                  handleNestedFieldChange("expenseItem", "otherExpenses", value)
                }
                required
              />
            </div>
            <div className="mt-4 px-3 py-1.5 bg-primary/5 rounded-lg flex items-cent justify-between text-primary">
              <p className="font-semibold">รวมค่าใช้จ่าย</p>
              <p className="text-lg font-semibold">
                {formatNumber(bData.expenseItem.totalExpense)} บาท/เดือน
              </p>
            </div>
          </div>

          {/* กำไรสุทธิ/ขาดทุนสุทธิ Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              (3) กำไรสุทธิ/ขาดทุนสุทธิ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>กำไรขั้นต้น</Label>
                <div className="px-3 py-1.5 bg-blue-50 rounded-lg text-blue-700 font-semibold">
                  {formatNumber(bData.profileLost.grossProfit)} บาท/เดือน
                </div>
              </div>

              <InputField
                label="ดอกเบี้ยจ่าย (บาท/เดือน)"
                type="number"
                placeholder="0"
                value={bData.profileLost.interestExpense}
                onChange={(value) =>
                  handleNestedFieldChange(
                    "profileLost",
                    "interestExpense",
                    value,
                  )
                }
                required
              />

              <div className="space-y-2">
                <Label>กำไรก่อนหักภาษี</Label>
                <div className="px-3 py-1.5 bg-green-50 rounded-lg text-green-700 font-semibold">
                  {formatNumber(bData.profileLost.profitBeforeTax)} บาท/เดือน
                </div>
              </div>

              <InputField
                label="ภาษี (บาท/เดือน)"
                type="number"
                placeholder="0"
                value={bData.profileLost.taxExpense}
                onChange={(value) =>
                  handleNestedFieldChange("profileLost", "taxExpense", value)
                }
                required
              />

              <div className="space-y-2">
                <Label>กำไรสุทธิ/ขาดทุนสุทธิ</Label>
                <div
                  className={`px-3 py-1.5 rounded-lg font-semibold ${
                    bData.profileLost.netProfit >= 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {formatNumber(bData.profileLost.netProfit)} บาท/เดือน
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[30%_70%] gap-4">
                <InputField
                  label="สัดส่วนผู้ถือหุ้น (ผู้กู้) (%)"
                  type="number"
                  placeholder="0"
                  value={bData.shareHolder.shareOfNetProfit}
                  onChange={(value) =>
                    handleNestedFieldChange(
                      "shareHolder",
                      "shareOfNetProfit",
                      value,
                    )
                  }
                  required
                  className="w-full"
                />

                <InputField
                  label="สัดส่วนผู้ถือหุ้น (ผู้กู้) (บาท/เดือน)"
                  type="number"
                  placeholder="0"
                  value={bData.shareHolder.bankNetProfit}
                  onChange={(value) =>
                    handleNestedFieldChange(
                      "shareHolder",
                      "bankNetProfit",
                      value,
                    )
                  }
                  required
                  readOnly
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>ค่าใช้จ่ายอื่นๆ (เพิ่มเติม)</Label>
                <div className="px-3 py-1.5 bg-orange-50 rounded-lg text-orange-700 font-semibold">
                  {formatNumber(bData.optionalOtherExpense)} บาท/เดือน
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[30%_70%] gap-4">
                <InputField
                  label="อัตรากำไรสุทธิ (%)"
                  type="number"
                  placeholder="0"
                  value={
                    bData.profileLost.grossProfit
                      ? (
                          bData.businessActivity.totalIncome /
                          bData.profileLost.grossProfit
                        ).toFixed(0)
                      : 0
                  }
                  onChange={(value) =>
                    handleNestedFieldChange(
                      "shareHolder",
                      "shareOfNetProfit",
                      value, // This looks like it was doing nothing since the value is readOnly in original and here
                    )
                  }
                  required
                  readOnly
                  className="w-full"
                />

                <InputField
                  label="อัตรากำไรสุทธิตามเกณฑ์ธนาคารที่กำหนด (%)"
                  type="number"
                  placeholder="0"
                  value={currentCareerMargin || 0}
                  onChange={(value) =>
                    handleNestedFieldChange(
                      "shareHolder",
                      "bankNetProfit",
                      value, // same here, was readOnly
                    )
                  }
                  required
                  readOnly
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-4 px-3 py-1.5 bg-primary/5 rounded-lg flex items-cent justify-between text-primary">
              <p className="font-semibold">
                กำไรสุทธิตามเกณฑ์ที่ธนาคารกำหนด ตามสัดส่วนผู้ถือหุ้น
              </p>
              <p className="text-lg font-semibold">
                {calculateLastProfit().toLocaleString("th-TH", {
                  maximumFractionDigits: 2,
                })}{" "}
                บาท/เดือน
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerFormSection;
