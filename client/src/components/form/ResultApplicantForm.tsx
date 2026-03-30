import type { ResultBorrowerData } from "@/types/evaluate_types";
import { UserCheck } from "lucide-react";
import InputField from "./InputField";

const ResultApplicantForm = ({
  applicants,
  onApplicantChange,
}: {
  applicants: ResultBorrowerData[];
  onApplicantChange: (
    applicantIndex: number,
    field: keyof ResultBorrowerData,
    value: number,
  ) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="border border-orange-400 rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-start py-4 px-6 bg-orange-50  border-b border-orange-400 rounded-t-lg">
          <div className="flex items-center gap-2">
            <UserCheck className="size-5 text-orange-700/80" />
            <h2 className="text-lg font-semibold text-orange-700">
              รายได้และค่าใช้จ่ายของผู้กู้
            </h2>
          </div>
        </div>

        {applicants.map((applicant, index) => {
          return (
            <div
              key={index}
              className="p-6 space-y-6 pb-6 border-b last:border-b-0"
            >
              <h3 className="text-lg font-semibold mb-4 text-orange-700">
                {applicant.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="อัตราเงินเดือน"
                  type="number"
                  placeholder="0"
                  value={Number(applicant.salary)}
                  suffix="บาท/เดือน"
                  onChange={(value) =>
                    onApplicantChange(index, "salary", Number(value))
                  }
                  required
                  readOnly
                />
                <InputField
                  label="รายการหักของหน่วยงานที่ไม่ใช่ภาระหนี้"
                  type="number"
                  placeholder="0"
                  value={Number(applicant.optionsSalary)}
                  suffix="บาท/เดือน"
                  onChange={(value) =>
                    onApplicantChange(index, "optionsSalary", Number(value))
                  }
                  required
                  readOnly
                />
                <InputField
                  label="เงินได้ประจำอื่นๆ"
                  type="number"
                  placeholder="0"
                  value={Number(applicant.otherSalary)}
                  suffix="บาท/เดือน"
                  onChange={(value) =>
                    onApplicantChange(index, "otherSalary", Number(value))
                  }
                  required
                  readOnly
                />
                <InputField
                  label="เงินได้อื่นๆ ที่มีหลักฐาน"
                  type="number"
                  placeholder="0"
                  value={Number(applicant.optionsSalary)}
                  suffix="บาท/เดือน"
                  onChange={(value) =>
                    onApplicantChange(index, "optionsSalary", Number(value))
                  }
                  required
                  readOnly
                />
                <InputField
                  label="กำไรสุทธิจากการประกอบอาชีพตามสัดส่วนการถือหุ้นในธุรกิจ"
                  type="number"
                  placeholder="0"
                  value={Number(applicant.resultShareValue)}
                  suffix="บาท/เดือน"
                  onChange={(value) =>
                    onApplicantChange(index, "resultShareValue", Number(value))
                  }
                  required
                  readOnly
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:col-span-2">
                  <div className="px-3 py-1.5 bg-orange-50 rounded-lg flex items-cent justify-between text-orange-700">
                    <p className="font-semibold">รายได้รวม</p>
                    <p className="text-lg font-semibold">
                      {applicant.totalSalary.toLocaleString("th-TH")} บาท/เดือน
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-orange-50 rounded-lg flex items-cent justify-between text-orange-700">
                    <p className="font-semibold">รายได้สุทธิรวม</p>
                    <p className="text-lg font-semibold">
                      {applicant.resultIncome.toLocaleString("th-TH")} บาท/เดือน
                    </p>
                  </div>
                </div>

                {/* Expenses Section */}
                <InputField
                  label="ค่าใช้จ่ายในการอุปโภคบริโภค"
                  type="number"
                  placeholder="0"
                  value={Number(applicant.customerExpenses)}
                  suffix="บาท/เดือน"
                  onChange={(value) =>
                    onApplicantChange(index, "customerExpenses", Number(value))
                  }
                  readOnly
                />
                <InputField
                  label="ผลลัพธ์ค่าใช้จ่ายในการอุปโภคบริโภค"
                  type="number"
                  placeholder="0"
                  value={applicant.resultCustomerExpenses}
                  suffix="บาท/เดือน"
                  onChange={(value) =>
                    onApplicantChange(
                      index,
                      "resultCustomerExpenses",
                      Number(value),
                    )
                  }
                  required
                  readOnly
                />
                <InputField
                  label="ค่าใช้จ่ายที่พักอาศัย"
                  type="number"
                  placeholder="0"
                  value={Number(applicant.livingExpenses)}
                  suffix="บาท/เดือน"
                  onChange={(value) =>
                    onApplicantChange(index, "livingExpenses", Number(value))
                  }
                  required
                />
                <InputField
                  label="ค่าใช่จ่ายอื่นๆ"
                  type="number"
                  placeholder="0"
                  value={Number(applicant.otherExpenses)}
                  suffix="บาท/เดือน"
                  onChange={(value) =>
                    onApplicantChange(index, "otherExpenses", Number(value))
                  }
                  required
                />
                <div className="col-span-2 px-3 py-1.5 bg-orange-100 rounded-lg flex items-cent justify-between text-orange-700">
                  <p className="font-semibold">ค่าใช้จ่ายรวม</p>
                  <p className="text-lg font-semibold">
                    {applicant.totalExpenses.toLocaleString("th-TH")} บาท/เดือน
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultApplicantForm;
