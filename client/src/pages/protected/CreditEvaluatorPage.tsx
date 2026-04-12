import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import EvaluatesTable from "@/components/table/EvaluatesTable";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useGetAllEvaluates } from "@/hooks/useAllEvaluates";
import { useDeleteEvaluate } from "@/hooks/useEvaluate";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface IFiltered {
  search: string;
  page: number;
  limit: number;
}

const CreditEvaluatorPage = () => {
  const [filtered, setFiltered] = useState<IFiltered>({
    search: "",
    page: 1,
    limit: 10,
  });

  const { data: evaluates, isLoading: isEvaluatesLoading } = useGetAllEvaluates({
    search: filtered.search,
    page: filtered.page,
    limit: filtered.limit,
  });
  const { mutateAsync: deleteEvaluate } = useDeleteEvaluate();

  const navigate = useNavigate();

  const handleFilterChange = (field: string, value: string | number) => {
    setFiltered((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClickUpdate = (id: string) => {
    navigate(`/credit-evaluator/edit/${id}`);
  };

  const handleClickDelete = async (id: string) => {
    await deleteEvaluate(id);
    Swal.fire({
      icon: "success",
      title: "ลบเอกสารสำเร็จ",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <div className="w-full max-w-7xl xl:max-w-360 mx-auto p-8 space-y-8">
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
        <Header
          title="เอกสารการประเมิน"
          subTitle="จัดการเอกสารการประเมินความสามารถในการชำระหนี้"
        />
      </div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
        <h3 className="w-full max-w-xs font-medium">
          เอกสารการประเมินทั้งหมดของคุณ{" "}
          <span className="mx-2 text-primary text-xl font-semibold">
            {evaluates?.pagination?.total || 0}
          </span>{" "}
          เอกสาร
        </h3>

        <div className="w-full flex items-center justify-end gap-2">
          {/* Search Input */}
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

          {/* Add btn */}
          <Button
            onClick={() => navigate("/credit-evaluator/add")}
            size={"lg"}
            className="cursor-pointer hover:scale-105 active:scale-100 transition-all duration-200"
          >
            <Plus /> เพิ่มการประเมิน
          </Button>
        </div>
      </div>

      {isEvaluatesLoading ? (
        <p>กำลังโหลด...</p>
      ) : evaluates && evaluates?.data?.length > 0 ? (
        <EvaluatesTable
          evaluates={evaluates?.data || []}
          onEdit={handleClickUpdate}
          onDelete={handleClickDelete}
        />
      ) : (
        <div className="w-full p-4 text-center">ไม่มีข้อมูล</div>
      )}

      {/* Pagination Logic */}
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

export default CreditEvaluatorPage;
