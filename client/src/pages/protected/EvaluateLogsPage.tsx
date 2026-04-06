import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import EvaluateLogsTable from "@/components/table/EvaluateLogsTable";
import Pagination from "@/components/Pagination";
import { getEvaluateLogs } from "@/services/superAdminService";
import type { IEvaluateLog } from "@/types/superadmin_types";
import { useAuthUser } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const EvaluateLogsPage = () => {
  const { data: authUser } = useAuthUser();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<IEvaluateLog[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authUser && authUser.role !== "SUPER_ADMIN") {
      navigate("/dashboard", { replace: true });
    }
  }, [authUser, navigate]);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getEvaluateLogs({ search, page, limit: 20 });
      setLogs(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.total);
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    if (authUser?.role === "SUPER_ADMIN") {
      fetchLogs();
    }
  }, [fetchLogs, authUser]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (authUser?.role !== "SUPER_ADMIN") return null;

  return (
    <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-8 space-y-8">
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
        <Header
          title="ประวัติการทำรายการ (Logs)"
          subTitle="ดูประวัติการสร้าง แก้ไข และลบเอกสารการประเมิน"
        />
      </div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
        <h3 className="w-full max-w-xs font-medium">
          ประวัติการทำรายการทั้งหมด{" "}
          <span className="mx-2 text-primary text-xl font-semibold">
            {totalItems || 0}
          </span>{" "}
          รายการ
        </h3>

        <div className="w-full flex items-center justify-end gap-2">
          <InputGroup className="max-w-xs h-10">
            <InputGroupInput
              placeholder="ค้นหาชื่อผู้ทำรายการ หรือ เหตุการณ์..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <InputGroupAddon>
              <InputGroupButton>
                <Search />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : logs.length > 0 ? (
        <>
          <EvaluateLogsTable logs={logs} />
          {totalPages > 1 && (
            <div className="w-full flex items-center justify-center mt-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="w-full p-4 text-center">ไม่มีประวัติการทำรายการ</div>
      )}
    </div>
  );
};

export default EvaluateLogsPage;
