import type { ISubCareer } from "@/types/career_types";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ISubCareerTableProps {
  data: ISubCareer[];
  categoryName: string;
  onEdit: (subCategory: ISubCareer) => void;
  onDelete: (subCategory: ISubCareer) => void;
}

const SubCareerTable = ({
  data,
  categoryName,
  onEdit,
  onDelete,
}: ISubCareerTableProps) => {
  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-16 text-center">ลำดับ</TableHead>
            <TableHead className="text-center">หมวดหมู่อาชีพ</TableHead>
            <TableHead className="text-center">ชื่ออาชีพย่อย</TableHead>
            <TableHead className="text-center">อัตรากำไรสุทธิ (%)</TableHead>
            <TableHead className="text-center w-24">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((subCategory, index) => (
            <TableRow
              key={subCategory.id}
              className="group hover:bg-gray-50/50 transition-colors"
            >
              <TableCell className="text-center text-gray-500">
                {index + 1}
              </TableCell>
              <TableCell className="text-center text-gray-700">
                {categoryName}
              </TableCell>
              <TableCell className="text-center font-medium">
                {subCategory.subCategoryName}
              </TableCell>
              <TableCell className="text-center text-gray-700">
                {subCategory.subNetProfit}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 bg-blue-100 border border-blue-200 transition-all duration-300 ease-in-out hover:bg-blue-200 hover:border-blue-300 cursor-pointer"
                    title="แก้ไข"
                    onClick={() => onEdit(subCategory)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 bg-red-100 border border-red-200 transition-all duration-300 ease-in-out hover:bg-red-200 hover:border-red-300 cursor-pointer"
                    title="ลบ"
                    onClick={() => onDelete(subCategory)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubCareerTable;
