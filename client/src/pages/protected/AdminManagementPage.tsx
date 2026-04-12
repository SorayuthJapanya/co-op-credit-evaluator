import { useEffect, useState, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import Header from "@/components/Header";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import AdminsTable from "@/components/table/AdminsTable";
import Pagination from "@/components/Pagination";
import { getAdmins, updateAdminRole, deleteAdmin } from "@/services/superAdminService";
import type { IAdmin } from "@/types/superadmin_types";
import { useAuthUser } from "@/hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RegisterAdminModal from "@/components/modal/RegisterAdminModal";

const AdminManagementPage = () => {
  const { data: authUser } = useAuthUser();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<IAdmin[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    if (authUser && authUser.role !== "SUPER_ADMIN") {
      navigate("/dashboard", { replace: true });
    }
  }, [authUser, navigate]);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAdmins({ search, page, limit: 10 });
      setAdmins(response.data);
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
        fetchAdmins();
    }
  }, [fetchAdmins, authUser]);

  const handleRoleUpdate = async (id: string, newRole: "ADMIN" | "SUPER_ADMIN") => {
    try {
      await updateAdminRole(id, newRole);
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "แก้ไขสิทธิ์ผู้ใช้งานเรียบร้อยแล้ว",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchAdmins();
    } catch {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเปลี่ยนสิทธิ์ได้",
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      icon: "warning",
      title: "ยืนยันการลบผู้ใช้งาน",
      text: `คุณต้องการลบผู้ใช้งาน ${name} ใช่หรือไม่?`,
      showCancelButton: true,
      confirmButtonText: "ลบผู้ใช้งาน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAdmin(id);
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "ลบผู้ใช้งานเรียบร้อยแล้ว",
            timer: 1500,
            showConfirmButton: false,
          });
          fetchAdmins();
        } catch {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบผู้ใช้งานได้",
          });
        }
      }
    });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (authUser?.role !== "SUPER_ADMIN") return null;

  return (
    <div className="w-full max-w-7xl xl:max-w-360 mx-auto p-8 space-y-8">
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
        <Header
          title="จัดการสิทธิ์ผู้ใช้งาน"
          subTitle="กำหนดสิทธิ์และดูแลบัญชีผู้ใช้ในระบบ"
        />
      </div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
        <h3 className="w-full max-w-xs font-medium">
          บัญชีผู้ใช้งานในระบบทั้งหมด{" "}
          <span className="mx-2 text-primary text-xl font-semibold">
            {totalItems || 0}
          </span>{" "}
          บัญชี
        </h3>

        <div className="w-full flex items-center justify-end gap-2">
          <InputGroup className="max-w-xs h-10">
            <InputGroupInput
              placeholder="ค้นหาชื่อ หรือ Username..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <InputGroupAddon>
              <InputGroupButton>
                <Search />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <Button
            onClick={() => setIsRegisterModalOpen(true)}
            size={"lg"}
            className="cursor-pointer hover:scale-105 active:scale-100 transition-all duration-200"
          >
            <Plus /> เพิ่มผู้ใช้งาน
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : admins.length > 0 ? (
        <>
          <AdminsTable 
            admins={admins} 
            onRoleUpdate={handleRoleUpdate} 
            onDelete={handleDelete}
            currentUserId={authUser?.id || ""} 
          />
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
        <div className="w-full p-4 text-center">ไม่มีข้อมูลผู้ใช้งาน</div>
      )}

      <RegisterAdminModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => fetchAdmins()}
      />
    </div>
  );
};

export default AdminManagementPage;
