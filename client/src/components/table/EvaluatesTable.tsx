import { useState } from "react";
import { Edit, Trash2, User, Download } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Swal from "sweetalert2";

interface EvaluatesTableProps {
  evaluates: Evaluate[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EvaluatesTable = ({
  evaluates,
  onEdit,
  onDelete,
}: EvaluatesTableProps) => {
  const [selectedEvaluate, setSelectedEvaluate] = useState<Evaluate | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      // 1. ดึง HTML จาก Backend
      const resp = await axiosInstance.get(exportUrl, { responseType: "text" });
      const html = resp.data as string;

      // 2. สร้าง Hidden Iframe เพื่อใช้สั่ง Print โดยไม่ต้องเปิดหน้าต่างใหม่
      const iframe = document.createElement("iframe");
      iframe.style.display = "none"; // ซ่อน iframe ไว้
      document.body.appendChild(iframe);

      const iframeDoc =
        iframe.contentWindow?.document || iframe.contentDocument;
      if (!iframeDoc) throw new Error("Cannot access iframe document");

      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      // 3. รอให้ Content โหลดเสร็จแล้วสั่ง Print (Save PDF)
      // ใช้ช่วงเวลาสั้นๆ เพื่อให้ Browser Render ตารางให้เสร็จก่อน
      setTimeout(() => {
        Swal.close();
        if (iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();

          // ลบ iframe ทิ้งหลังจากสั่งพิมพ์เสร็จ (เพื่อประหยัด Memory)
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }
      }, 500);
    } catch (err: any) {
      Swal.close();
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการส่งออก",
        text: err?.message || "กรุณาลองอีกครั้ง",
      });
    }
  };

  const handleEditClick = (e: React.MouseEvent, evaluate: Evaluate) => {
    e.stopPropagation();
    onEdit(evaluate.id);
  };

  const handleDeleteClick = (e: React.MouseEvent, evaluate: Evaluate) => {
    e.stopPropagation();
    Swal.fire({
      icon: "question",
      title: "ยืนยันการลบข้อมูล",
      text: `คุณต้องการลบข้อมูลการประเมินนี้หรือไม่?`,
      showCancelButton: true,
      confirmButtonText: "ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังลบข้อมูล...",
          showCancelButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        onDelete(evaluate.id);
      }
    });
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

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-16 text-center">ลำดับ</TableHead>
            <TableHead className="text-center">วันที่ทำรายการ</TableHead>
            <TableHead>ชื่อผู้กู้</TableHead>
            <TableHead className="text-center">รายได้</TableHead>
            <TableHead className="text-center">ภาระหนี้รวม</TableHead>
            <TableHead className="text-center">DTI</TableHead>
            <TableHead className="text-center">DSCR</TableHead>
            <TableHead className="text-center">ผลการประเมิน</TableHead>
            <TableHead className="text-center w-24">จัดการ</TableHead>
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
                {evaluate.result.dscr < 1 ? (
                  <span className="px-3 py-1 bg-red-100 text-red-700 font-medium rounded-md">
                    ไม่เป็นไปตามเกณฑ์
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-700 font-medium rounded-md">
                    เป็นไปตามเกณฑ์
                  </span>
                )}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="ส่งออก"
                    onClick={(e) => handleExportClick(e, evaluate)}
                    className="h-8 w-8 text-indigo-600 hover:text-indigo-700 bg-indigo-100 border border-indigo-200 transition-all duration-300 ease-in-out hover:bg-indigo-200 hover:border-indigo-300 cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-emerald-600 hover:text-emerald-700 bg-emerald-100 border border-emerald-200 transition-all duration-300 ease-in-out hover:bg-emerald-200 hover:border-emerald-300 cursor-pointer"
                    title="แก้ไข"
                    onClick={(e) => handleEditClick(e, evaluate)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 bg-red-100 border border-red-200 transition-all duration-300 ease-in-out hover:bg-red-200 hover:border-red-300 cursor-pointer"
                    title="ลบ"
                    onClick={(e) => handleDeleteClick(e, evaluate)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {/* ปรับแก้ typo จาก ภxl เป็น 4xl และเพิ่ม max-h-[85vh] overflow-y-auto เพื่อให้ Modal scroll ได้เมื่อข้อมูลยาว */}
        <DialogContent className="w-full sm:max-w-4xl max-h-[85vh] overflow-y-auto [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-medium flex items-center gap-2 border-b border-gray-200 pb-4">
              <User className="w-6 h-6" /> รายละเอียดการประเมิน
              <span className="ml-auto text-xs sm:text-sm font-normal text-gray-500">
                วันที่:{" "}
                {selectedEvaluate?.createdAt
                  ? formatDateToThai(selectedEvaluate.createdAt)
                  : ""}
              </span>
            </DialogTitle>
          </DialogHeader>

          {selectedEvaluate && (
            <div className="space-y-8 py-4">
              {/* Section 1: Highlight Metrics (ตัวเลขสำคัญสำหรับการตัดสินใจ) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm font-medium text-blue-600 mb-1">DTI</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {selectedEvaluate.result.dti.toFixed(2)} เท่า
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-sm font-medium text-emerald-600 mb-1">
                    DSCR
                  </p>
                  <p className="text-2xl font-bold text-emerald-900">
                    {selectedEvaluate.result.dscr.toFixed(2)} %
                  </p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    รายได้สุทธิประเมิน
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    ฿{" "}
                    {selectedEvaluate.result.applicants
                      .reduce(
                        (total, applicant) => total + applicant.resultIncome,
                        0,
                      )
                      .toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    ภาระหนี้รวม
                  </p>
                  <p className="text-xl font-bold text-red-600">
                    ฿{" "}
                    {selectedEvaluate.result.debtDetail.totalDebt.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Section 2: ข้อมูลผู้สมัคร และ อาชีพ */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  ประเภทสินเชื่อ: {selectedEvaluate.evaluateType}
                </h3>
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  ประเภทเงินกู้: {selectedEvaluate.marginType}
                </h3>
                {selectedEvaluate.applicants.map((applicant, index) => (
                  <div key={index} className="my-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      ผู้สมัครที่ {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ชื่อผู้กู้
                        </label>
                        <p className="text-gray-900 font-medium mt-1">
                          {applicant.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          เลขบัตรประชาชน
                        </label>
                        <p className="text-gray-900 font-medium mt-1">
                          {applicant.idCard}
                        </p>
                      </div>
                      {applicant.careerCategory && applicant.career && (
                        <>
                          <div className="sm:col-span-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              หมวดหมู่อาชีพ
                            </label>
                            <p className="text-gray-900 mt-1">
                              {applicant.careerCategory}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              อาชีพหลัก
                            </label>
                            <p className="text-gray-900 mt-1">
                              {applicant.career}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 3: รายละเอียดทางการเงิน แบ่ง 2 คอลัมน์ (รายได้ vs ภาระหนี้/ค่าใช้จ่าย) */}
              <div className="space-y-6">
                {selectedEvaluate.result.applicants.map((applicant, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 sm:pb-8 border-b border-gray-200 last:border-b-0 last:pb-0"
                  >
                    <div className="lg:col-span-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        ข้อมูลทางการเงิน - ผู้สมัครที่ {index + 1}
                      </h3>
                    </div>
                    {/* Column Left: ฝั่งรายได้ */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900 border-b pb-2">
                        โครงสร้างรายได้
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-600">อัตราเงินเดือน</span>
                          <span className="font-medium text-gray-900">
                            ฿ {applicant.totalSalary.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-600">
                            เงินได้ประจำอื่นๆ
                          </span>
                          <span className="font-medium text-gray-900">
                            ฿ {applicant.otherSalary.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-600">
                            เงินได้อื่นๆ ที่มีหลักฐาน
                          </span>
                          <span className="font-medium text-gray-900">
                            ฿ {applicant.optionsSalary.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-600">
                            กำไรสุทธิจากการประกอบอาชีพตามสัดส่วนการถือหุ้นในธุรกิจ
                          </span>
                          <span className="font-medium text-gray-900">
                            ฿ {applicant.resultShareValue.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <span className="text-sm font-semibold text-gray-900">
                            รวมรายได้ประเมิน (Total Salary)
                          </span>
                          <span className="font-semibold text-gray-900">
                            ฿ {applicant.totalSalary.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Column Right: ฝั่งภาระหนี้และค่าใช้จ่าย */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900 border-b pb-2">
                        ภาระหนี้สินและค่าใช้จ่าย
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-600">
                            รายการหักของหน่วยงานที่ไม่ใช่ภาระหนี้
                          </span>
                          <span className="font-medium text-red-600">
                            ฿ {applicant.expenses.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-600">
                            ค่าใช้จ่ายในการอุปโภคบริโภค
                          </span>
                          <span className="font-medium text-red-600">
                            ฿{" "}
                            {applicant.resultCustomerExpenses.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-600">
                            ค่าใช้จ่ายที่พักอาศัย
                          </span>
                          <span className="font-medium text-red-600">
                            ฿ {applicant.livingExpenses.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-600">ค่าใช่จ่ายอื่นๆ</span>
                          <span className="font-medium text-red-600">
                            ฿ {applicant.otherExpenses.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <span className="text-sm font-semibold text-gray-900">
                            ค่าใช้จ่ายรวม
                          </span>
                          <span className="font-semibold text-red-600">
                            ฿ {applicant.totalExpenses.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EvaluatesTable;
