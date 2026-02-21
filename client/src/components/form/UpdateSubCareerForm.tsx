import { useUpdateSubCareer } from "@/hooks/useCareerCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import type { ISubCareer } from "@/types/career_types";
import { useEffect } from "react";

interface UpdateSubCareerFormProps {
  subCategory: ISubCareer;
  setIsEditOpen: (value: boolean) => void;
}

const updateSubCareerSchema = z.object({
  subCategoryName: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่อาชีพ"),
  subNetProfit: z.string().min(1, "กรุณาเปอร์เซนต์สุทธิ"),
});

const UpdateSubCareerForm = ({
  subCategory,
  setIsEditOpen,
}: UpdateSubCareerFormProps) => {
  const { mutateAsync: updateSubCareer, isPending: isUpdatePending } =
    useUpdateSubCareer();

  const form = useForm<z.infer<typeof updateSubCareerSchema>>({
    resolver: zodResolver(updateSubCareerSchema),
    defaultValues: {
      subCategoryName: subCategory.subCategoryName,
      subNetProfit: String(subCategory.subNetProfit),
    },
  });

  useEffect(() => {
    form.reset({
      subCategoryName: subCategory.subCategoryName,
      subNetProfit: String(subCategory.subNetProfit),
    });
  }, [subCategory, form]);

  const onSubmit = async (data: z.infer<typeof updateSubCareerSchema>) => {
    try {
      const payload = {
        subCategoryName: data.subCategoryName,
        subNetProfit: Number(data.subNetProfit),
        categoryId: subCategory.categoryId,
      };
      await updateSubCareer({ id: subCategory.id, data: payload });
      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* SubCategory Name */}
      <Controller
        name="subCategoryName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <Input
              {...field}
              id="subCategoryName"
              aria-invalid={!!fieldState.error}
              placeholder="กรอกชื่ออาชีพ"
              className="text-[16px]! h-12"
            />
            {fieldState.error?.message && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />

      {/* SubNet Profit */}
      <Controller
        name="subNetProfit"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <Input
              {...field}
              id="subNetProfit"
              type="number"
              aria-invalid={!!fieldState.error}
              className="text-[16px]! h-12"
              placeholder="กรอกเปอร์เซนต์สุทธิ"
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
          onClick={() => setIsEditOpen(false)}
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
  );
};

export default UpdateSubCareerForm;
