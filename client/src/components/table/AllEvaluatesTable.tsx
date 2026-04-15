import { useState } from "react";
import { Download } from "lucide-react";
import { axiosInstance } from "@/utils/axios";
import type { Evaluate } from "@/types/evaluate_types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDateToThai } from "@/utils";
import Swal from "sweetalert2";
import { useAuthUser } from "@/hooks/useAuth";
import EvaluateDetailDialog from "@/components/dialog/EvaluateDetailDialog";

interface AllEvaluatesTableProps {
  evaluates: Evaluate[];
}

const AllEvaluatesTable = ({ evaluates }: AllEvaluatesTableProps) => {
  const [selectedEvaluate, setSelectedEvaluate] = useState<Evaluate | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading } = useAuthUser();

  const handleRowClick = (evaluate: Evaluate) => {
    setSelectedEvaluate(evaluate);
    setIsModalOpen(true);
  };

  const handleExportClick = async (e: React.MouseEvent, evaluate: Evaluate) => {
    e.preventDefault();
    e.stopPropagation();

    const exportUrl = `/protected/evaluates/${evaluate.id}/export`;

    try {
      Swal.fire({
        title: "กำลังเตรียมไฟล์ PDF...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const resp = await axiosInstance.get(exportUrl, { responseType: "text" });
      const html = resp.data as string;

      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const iframeDoc =
        iframe.contentWindow?.document || iframe.contentDocument;
      if (!iframeDoc) throw new Error("Cannot access iframe document");

      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      setTimeout(() => {
        Swal.close();
        if (iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();

          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }
      }, 500);
    } catch {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการส่งออก",
        text: "กรุณาลองอีกครั้ง",
      });
    }
  };

  const getOwnerName = (evaluate: Evaluate) => {
    return <p>{evaluate.user?.fullname ?? evaluate.userId}</p>;
  };

  const getBorrowerName = (evaluate: Evaluate) => {
    return evaluate.result.applicants?.map((applicant) => (
      <p key={applicant.idCard}>{applicant.name}</p>
    ));
  };

  const getTotalSalary = (evaluate: Evaluate) => {
    return evaluate.result.applicants?.map((applicant) => (
      <p key={applicant.idCard}>฿ {applicant.totalSalary.toLocaleString()}</p>
    ));
  };

  const getTotalDebt = (evaluate: Evaluate) => {
    return evaluate.result.debtDetail?.totalDebt || 0;
  };

  const getDTI = (evaluate: Evaluate) => {
    return evaluate.result.dti || 0;
  };

  const getDSCR = (evaluate: Evaluate) => {
    return evaluate.result.dscr || 0;
  };

  if (isLoading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-16 text-center">ลำดับ</TableHead>
            <TableHead className="text-center">วันที่ทำรายการ</TableHead>
            <TableHead className="text-center">ผู้ดำเนินการ</TableHead>
            <TableHead>ชื่อผู้กู้</TableHead>
            <TableHead className="text-center">รายได้</TableHead>
            <TableHead className="text-center">ภาระหนี้รวม</TableHead>
            <TableHead className="text-center">DTI</TableHead>
            <TableHead className="text-center">DSCR</TableHead>
            <TableHead className="text-center">ผลการอนุมัติ</TableHead>
            <TableHead className="text-center w-20">ส่งออก</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluates.map((evaluate, index) => (
            <TableRow
              key={evaluate.id}
              className="group cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => handleRowClick(evaluate)}
            >
              <TableCell className="text-center text-gray-500">
                {index + 1}
              </TableCell>
              <TableCell className="text-gray-700 text-center">
                {formatDateToThai(evaluate.createdAt || "")}
              </TableCell>
              <TableCell className="font-medium">
                {getOwnerName(evaluate)}
              </TableCell>
              <TableCell className="font-medium">
                {getBorrowerName(evaluate)}
              </TableCell>
              <TableCell className="text-center text-green-600 font-medium whitespace-nowrap">
                {getTotalSalary(evaluate)}
              </TableCell>
              <TableCell className="text-center text-red-600 font-medium whitespace-nowrap">
                ฿ {getTotalDebt(evaluate).toLocaleString()}
              </TableCell>
              <TableCell className="text-center text-gray-700">
                <span className="px-3 py-1 bg-green-100 text-green-700 font-medium rounded-md">
                  {getDTI(evaluate).toFixed(2)} %
                </span>
              </TableCell>
              <TableCell className="text-center text-gray-700">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-md">
                  {getDSCR(evaluate).toFixed(2)} เท่า
                </span>
              </TableCell>
              <TableCell className="text-center">
                {evaluate.status === "อนุมัติ" ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 font-medium rounded-md">
                    อนุมัติ
                  </span>
                ) : evaluate.status === "ไม่อนุมัติ" ? (
                  <span className="px-3 py-1 bg-red-100 text-red-700 font-medium rounded-md">
                    ไม่อนุมัติ
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 font-medium rounded-md">
                    รอการอนุมัติ
                  </span>
                )}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="ส่งออก"
                    onClick={(e) => handleExportClick(e, evaluate)}
                    className="h-8 w-8 text-indigo-600 hover:text-indigo-700 bg-indigo-100 border border-indigo-200 transition-all duration-300 ease-in-out hover:bg-indigo-200 hover:border-indigo-300 cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EvaluateDetailDialog
        evaluate={selectedEvaluate}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onExport={handleExportClick}
      />
    </div>
  );
};

export default AllEvaluatesTable;
