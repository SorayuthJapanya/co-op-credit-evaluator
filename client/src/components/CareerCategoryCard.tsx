import type { ICareerCategory } from "@/types/career_types";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CareerCategoryCardProps {
  category: ICareerCategory;
  onEdit?: (category: ICareerCategory) => void;
  onDelete?: (category: ICareerCategory) => void;
}

const CareerCategoryCard = ({
  category,
  onEdit,
  onDelete,
}: CareerCategoryCardProps) => {
  const navigate = useNavigate();
  const onClickCard = (category: ICareerCategory) => {
    if (!category) return null;
    const { id, categoryName } = category;
    navigate(
      `/manage-sub-career?categoryId=${id}&categoryName=${categoryName}`,
    );
  };

  return (
    <div
      onClick={() => onClickCard(category)}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 gap-4"
    >
      {/* Left Section: Info */}
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg md:text-xl font-medium leading-tight">
          {category.categoryName}
        </h3>
        <p className="text-sm sm:text-base text-gray-500">
          มีอาชีพย่อยทั้งหมด{" "}
          <span className="font-semibold text-primary">
            {category.subCategory?.length || 0}
          </span>{" "}
          อาชีพ
        </p>
      </div>

      {/* Right Section: Actions */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-3"
      >
        <Button
          variant="outline"
          className="flex items-center gap-2 cursor-pointer border-blue-200 text-primary/80 hover:bg-blue-50 hover:text-primary py-5 px-4"
          onClick={() => onEdit && onEdit(category)}
        >
          <Pencil className="w-5 h-5" />
          <span className="text-base font-medium">แก้ไข</span>
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 cursor-pointer border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 py-5 px-4"
          onClick={() => onDelete && onDelete(category)}
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-base font-medium">ลบ</span>
        </Button>
      </div>
    </div>
  );
};

export default CareerCategoryCard;
