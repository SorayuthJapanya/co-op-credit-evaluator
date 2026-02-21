import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardFiltersProps {
  selectedYear: string;
  selectedSubdistrict: string;
  onYearChange: (year: string) => void;
  onSubdistrictChange: (subdistrict: string) => void;
  subdistricts: string[];
}

const YEARS = ["2568", "2569", "2570", "2571", "2572"];

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  selectedYear,
  selectedSubdistrict,
  onYearChange,
  onSubdistrictChange,
  subdistricts,
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-end">
      <div className="w-full flex items-center gap-2">
        <span className="text-nowrap text-sm font-medium text-gray-700">ปีบัญชี:</span>
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="เลือกปีบัญชี" />
          </SelectTrigger>
          <SelectContent align="center">
            <SelectItem value="all">ทุกปีบัญชี</SelectItem>
            {YEARS.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full flex items-center gap-2">
        <span className="text-nowrap text-sm font-medium text-gray-700">ตำบล:</span>
        <Select value={selectedSubdistrict} onValueChange={onSubdistrictChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="เลือกตำบล" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกตำบล</SelectItem>
            {subdistricts.map((subdistrict) => (
              <SelectItem key={subdistrict} value={subdistrict}>
                {subdistrict}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
