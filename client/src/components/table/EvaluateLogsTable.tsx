import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IEvaluateLog } from "@/types/superadmin_types";

interface EvaluateLogsTableProps {
  logs: IEvaluateLog[];
}

const EvaluateLogsTable = ({ logs }: EvaluateLogsTableProps) => {

  const formatDateTime = (dateString: string) => {
    try {
      // Server stores UTC but may emit a wrong timezone offset (e.g. +07:00).
      // Strip any offset and force-parse as UTC, then manually shift to UTC+7.
      const stripped = dateString.replace(/[+-]\d{2}:\d{2}$/, "");
      const utcDate = new Date(stripped.endsWith("Z") ? stripped : stripped + "Z");
      if (isNaN(utcDate.getTime())) return dateString;

      const thaiMs = utcDate.getTime() + 7 * 60 * 60 * 1000;
      const d = new Date(thaiMs);

      const thaiMonths = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
      ];

      const day = d.getUTCDate();
      const month = thaiMonths[d.getUTCMonth()];
      const year = d.getUTCFullYear() + 543;
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");

      return `${day} ${month} ${year} ${hh}:${mm}:${ss}`;
    } catch {
      return dateString;
    }
  };

  console.log("logs: ", logs);

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-16 text-center whitespace-nowrap">ลำดับ</TableHead>
            <TableHead className="text-center w-56 whitespace-nowrap">เวลาที่ทำรายการ</TableHead>
            <TableHead className="w-48 whitespace-nowrap">ชื่อผู้ทำรายการ</TableHead>
            <TableHead className="w-48 text-center whitespace-nowrap">สิทธิ์</TableHead>
            <TableHead className="whitespace-nowrap">เหตุการณ์ (Action)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-10">
                ไม่พบประวัติการทำรายการ
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log, index) => (
              <TableRow key={log.logs_id || index} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="p-3 text-center text-gray-500">{index + 1}</TableCell>
                <TableCell className="text-gray-700 text-center whitespace-nowrap">
                  {formatDateTime(log.timestamp)}
                </TableCell>
                <TableCell className="font-medium whitespace-nowrap">{log.fullname}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-3 py-1 font-medium rounded-md text-xs tracking-wider whitespace-nowrap ${
                      log.role === "SUPER_ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {log.role}
                  </span>
                </TableCell>
                <TableCell className="text-gray-800">{log.action}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EvaluateLogsTable;
