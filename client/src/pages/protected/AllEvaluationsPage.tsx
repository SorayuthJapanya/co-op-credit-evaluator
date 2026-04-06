import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import AllEvaluatesTable from "@/components/table/AllEvaluatesTable";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useGetAllEvaluates } from "@/hooks/useAllEvaluates";
import { Search } from "lucide-react";
import { useState } from "react";

interface IFiltered {
  search: string;
  page: number;
  limit: number;
}

const AllEvaluationsPage = () => {
  const [filtered, setFiltered] = useState<IFiltered>({
    search: "",
    page: 1,
    limit: 10,
  });

  const { data: evaluates, isLoading: isEvaluatesLoading } =
    useGetAllEvaluates({
      search: filtered.search,
      page: filtered.page,
      limit: filtered.limit,
    });

  const handleFilterChange = (field: string, value: string | number) => {
    setFiltered((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-8 space-y-8">
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
        <Header
          title="เอกสารประเมินทั้งหมด"
          subTitle="ดูเอกสารการประเมินความสามารถในการชำระหนี้ทั้งหมดในระบบ"
        />
      </div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
        <h3 className="w-full max-w-xs font-medium">
          เอกสารการประเมินทั้งหมด{" "}
          <span className="mx-2 text-primary text-xl font-semibold">
            {evaluates?.pagination?.total || 0}
          </span>{" "}
          เอกสาร
        </h3>

        <div className="w-full flex items-center justify-end gap-2">
          <InputGroup className="max-w-xs h-10">
            <InputGroupInput
              placeholder="ค้นหา..."
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            <InputGroupAddon>
              <InputGroupButton>
                <Search />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      {isEvaluatesLoading ? (
        <p>กำลังโหลด...</p>
      ) : evaluates && evaluates?.data?.length > 0 ? (
        <AllEvaluatesTable evaluates={evaluates?.data || []} />
      ) : (
        <div className="w-full p-4 text-center">ไม่มีข้อมูล</div>
      )}

      {evaluates && evaluates?.data?.length !== 0 ? (
        <div className="w-full flex items-center justify-center mt-4">
          <Pagination
            page={filtered.page}
            totalPages={evaluates?.pagination?.totalPages || 0}
            onPageChange={(page) => handleFilterChange("page", page)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AllEvaluationsPage;
