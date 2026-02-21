import ActionSubCareer from "@/components/ActionSubCareer";
import Header from "@/components/Header";
import SubCareerTable from "@/components/table/SubCareerTable";
import {
  useDeleteSubCareer,
  useGetSubCategoriesByCategory,
} from "@/hooks/useCareerCategory";
import type { ISubCareer } from "@/types/career_types";
import { useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UpdateSubCareerForm from "@/components/form/UpdateSubCareerForm";
import Pagination from "@/components/Pagination";

const ManageSubCareer = () => {
  // Get categoryId and categoryName from searchParams
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const categoryName = searchParams.get("categoryName");

  // State for search and modals
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<ISubCareer | null>(null);

  const {
    data: subCategoriesResponse,
    isPending,
    error: errorGetSubCategories,
  } = useGetSubCategoriesByCategory(categoryId, page, limit, searchTerm);

  const subCategories = subCategoriesResponse?.data || [];
  const pagination = subCategoriesResponse?.pagination;

  const { mutateAsync: deleteSubCategory } = useDeleteSubCareer();

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleEditClick = (subCategory: ISubCareer) => {
    setSelectedSubCategory(subCategory);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (subCategory: ISubCareer) => {
    Swal.fire({
      icon: "question",
      title: "ยืนยันการลบอาชีพ?",
      text: `คุณแน่ใจใช่ไหมว่าจะลบข้อมูลของ ${subCategory.subCategoryName}`,
      showCancelButton: true,
      confirmButtonText: "ยืนยันลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังลบข้อมูล...",
          text: "กรุณารอสักครู่",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await deleteSubCategory(subCategory.id);
        Swal.close();
      }
    });
  };

  // Check if categoryId and categoryName is valid
  if (!categoryId || !categoryName) {
    return <Navigate to="/protected/career" />;
  }

  if (errorGetSubCategories) {
    return (
      <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-8">
        <div className="text-red-500">{errorGetSubCategories?.message}</div>
      </div>
    );
  }

  console.log(subCategories);

  return (
    <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-4 sm:p-8 space-y-6">
      {/* Header Section */}
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:justify-between mb-8">
        <Header
          title={`จัดการหมวดหมู่อาชีพ ${categoryName}`}
          subTitle="แก้ไขข้อมูลหมวดหมู่อาชีพและอัตรากำไรสุทธิ"
        />
      </div>

      {/* All User & filters */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
        <h3 className="font-medium">
          อาชีพทั้งหมด{" "}
          <span className="mx-2 text-primary text-xl font-semibold">
            {pagination?.total || 0}
          </span>{" "}
          อาชีพ
        </h3>

        {/* Filtered Term */}
        <ActionSubCareer
          categoryId={categoryId}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          isAddOpen={isAddOpen}
          setIsAddOpen={setIsAddOpen}
          isPending={isPending}
        />
      </div>

      {/* SubCareer table */}
      <div className="w-full">
        {subCategories && subCategories.length > 0 ? (
          <SubCareerTable
            data={subCategories}
            categoryName={categoryName}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        ) : isPending ? (
          <div className="w-full flex items-center justify-center">
            <p className="text-gray-500">กำลังโหลด...</p>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-gray-500">ไม่พบข้อมูล</p>
          </div>
        )}
      </div>

      {/* Pagination Logic */}
      {subCategories && subCategories.length > 0 ? (
        <div className="w-full flex items-center justify-center mt-4">
          <Pagination
            page={page}
            totalPages={pagination?.totalPages || 0}
            onPageChange={setPage}
          />
        </div>
      ) : null}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-full sm:max-w-md [&>button]:size-8 [&>button]:p-2 [&>button]:rounded-full [&>button]:hover:bg-primary/10 [&>button]:hover:text-primary [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:duration-200 [&>button]:transition-colors">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium flex items-center justify-center gap-2 border-b border-gray-200 pb-4">
              แก้ไขข้อมูลอาชีพย่อย
            </DialogTitle>
          </DialogHeader>
          {selectedSubCategory && (
            <UpdateSubCareerForm
              subCategory={selectedSubCategory}
              setIsEditOpen={setIsEditOpen}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageSubCareer;
