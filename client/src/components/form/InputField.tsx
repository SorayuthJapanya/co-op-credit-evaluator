import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  label: string;
  type?: "text" | "number" | "email" | "tel";
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
  className?: string;
  suffix?: string;
  required?: boolean;
  readOnly?: boolean;
}

const InputField = ({
  label,
  type = "text",
  placeholder = "0",
  value,
  onChange,
  disabled = false,
  className = "",
  suffix,
  required = false,
  readOnly = false,
}: InputFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      onChange(parseFloat(e.target.value) || 0);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      <div className="relative">
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          className={suffix ? "pr-16" : ""}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;
