import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import {
  useGetCareerCategories,
  useUpdateCareerCategory,
  useDeleteCareerCategory,
} from "@/hooks/useCareerCategory";
import ActionCareerCategory from "@/components/ActionCareerCategory";
import type { ICareerCategory } from "@/types/career_types";
import CareerCategoryCard from "@/components/CareerCategoryCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import Swal from "sweetalert2";

const editCareerCategorySchema = z.object({
  categoryName: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่อาชีพ"),
});

const ManageCareerCategoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ICareerCategory | null>(null);

  // Get Career Categories
  const {
    data: careerCategories,
    isPending,
    error: errorCareerCategories,
  } = useGetCareerCategories();

  const { mutateAsync: updateCategory, isPending: isUpdatePending } =
    useUpdateCareerCategory();
  const { mutateAsync: deleteCategory } = useDeleteCareerCategory();

  const form = useForm<z.infer<typeof editCareerCategorySchema>>({
    resolver: zodResolver(editCareerCategorySchema),
    defaultValues: {
      categoryName: "",
    },
  });

  useEffect(() => {
    if (selectedCategory) {
      form.reset({
        categoryName: selectedCategory.categoryName,
      });
    }
  }, [selectedCategory, form]);

  const onEditSubmit = async (
    data: z.infer<typeof editCareerCategorySchema>,
  ) => {
    if (!selectedCategory) return;
    try {
      await updateCategory({ id: selectedCategory.id, data });
      setIsEditOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (category: ICareerCategory) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (category: ICareerCategory) => {
    Swal.fire({
      icon: "question",
      title: "ยืนยันการลบหมวดหมู่อาชีพ?",
      text: `คุณแน่ใจใช่ไหมว่าจะลบข้อมูลของ ${category.categoryName}`,
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
        await deleteCategory(category.id);
        Swal.close();
      }
    });
  };

  const filteredCareerCategories = useMemo(() => {
    if (!careerCategories) return [];
    return careerCategories.filter((category: ICareerCategory) => {
      const matchCategory = category.categoryName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchCategory;
    });
  }, [careerCategories, searchTerm]);

  if (errorCareerCategories) {
    return (
      <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-8">
        <div className="text-red-500">{errorCareerCategories?.message}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-4 sm:p-8 space-y-6">
      {/* Header Section */}
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:justify-between mb-8">
        <Header
          title="จัดการหมวดหมู่อาชีพ"
          subTitle="แก้ไขข้อมูลหมวดหมู่อาชีพและอัตรากำไรสุทธิ"
        />
      </div>

      {/* All User & filters */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
        <h3 className="font-medium">
          หมวดหมู่อาชีพทั้งหมด{" "}
          <span className="mx-2 text-primary text-xl font-semibold">
            {filteredCareerCategories?.length || 0}
          </span>{" "}
          หมวดหมู่
        </h3>

        {/* Filtered Term */}
        <ActionCareerCategory
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          isAddOpen={isAddOpen}
          setIsAddOpen={setIsAddOpen}
          isPending={isPending}
        />
      </div>

      {/* Career Category Card */}
      <div className="w-full">
        {filteredCareerCategories && filteredCareerCategories.length > 0 ? (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredCareerCategories.map((category: ICareerCategory) => (
              <CareerCategoryCard
                key={category.id}
                category={category}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : isPending ? (
          <div className="w-full flex items-center justify-center">
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-gray-500">ไม่พบข้อมูล</p>
          </div>
        )}
      </div>

      {/* Edit Category Dialog */}
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setSelectedCategory(null);
        }}
      >
        <DialogContent className="overflow-y-auto max-h-[90vh] sm:max-w-sm w-full z-70 [&>button]:size-8 [&>button]:p-2 [&>button]:rounded-full [&>button]:hover:bg-primary/10 [&>button]:hover:text-primary [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:duration-200 [&>button]:transition-colors">
          <DialogHeader>
            <DialogTitle className="text-2xl">แก้ไขหมวดหมู่</DialogTitle>
          </DialogHeader>

          {/* edit form */}
          <form
            onSubmit={form.handleSubmit(onEditSubmit)}
            className="space-y-4"
          >
            {/* Category Name */}
            <Controller
              name="categoryName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <Input
                    {...field}
                    id="categoryName"
                    aria-invalid={!!fieldState.error}
                    placeholder="กรอกชื่อหมวดหมู่อาชีพ"
                    className="text-[16px]! h-12"
                  />
                  {fieldState.error?.message && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedCategory(null);
                }}
                disabled={isUpdatePending}
                className="cursor-pointer"
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                disabled={isUpdatePending}
                className="cursor-pointer"
              >
                {isUpdatePending ? <Spinner className="size-4 mr-2" /> : null}
                บันทึกข้อมูล
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCareerCategoryPage;
