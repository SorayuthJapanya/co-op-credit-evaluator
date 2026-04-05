import { Briefcase, HandCoins, Check } from "lucide-react";

export type EvaluateFormType = "career" | "salary";

interface FormTypeSelectorProps {
  selected: EvaluateFormType | "";
  onChange: (type: EvaluateFormType) => void;
}

const options: {
  value: EvaluateFormType;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  borderColor: string;
  bgColor: string;
  iconBg: string;
}[] = [
  {
    value: "career",
    icon: Briefcase,
    title: "อาชีพอิสระ / ธุรกิจ",
    description:
      "ประเมินรายได้จากกิจการ ค่าใช้จ่าย กำไร/ขาดทุนสุทธิตามสัดส่วนผู้ถือหุ้น",
    color: "text-primary",
    borderColor: "border-primary",
    bgColor: "bg-primary/5",
    iconBg: "bg-primary/10",
  },
  {
    value: "salary",
    icon: HandCoins,
    title: "เงินเดือนประจำ",
    description:
      "ประเมินรายได้จากเงินเดือน เบี้ยเลี้ยง ค่าตำแหน่ง และรายได้อื่นๆ",
    color: "text-orange-600",
    borderColor: "border-orange-400",
    bgColor: "bg-orange-50",
    iconBg: "bg-orange-100",
  },
];

const FormTypeSelector = ({ selected, onChange }: FormTypeSelectorProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">
        เลือกประเภทฟอร์มสำหรับผู้กู้
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selected === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`relative flex flex-col items-center text-center gap-3 rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? `${option.borderColor} ${option.bgColor} shadow-md scale-[1.02]`
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }
              `}
            >
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  isSelected ? option.iconBg : "bg-gray-100"
                }`}
              >
                <Icon
                  className={`h-7 w-7 ${isSelected ? option.color : "text-gray-400"}`}
                />
              </div>
              <div>
                <p
                  className={`text-base font-semibold ${isSelected ? option.color : "text-gray-700"}`}
                >
                  {option.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FormTypeSelector;
