import { useCreateSubCareer } from "@/hooks/useCareerCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface AddSubCareerFormProps {
  categoryId: string;
  setIsAddOpen: (value: boolean) => void;
  isPending: boolean;
}

const addSubCareerSchema = z.object({
  subCategoryName: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่อาชีพ"),
  subNetProfit: z.string().min(1, "กรุณาเปอร์เซนต์สุทธิ")
});

const AddSubCareerForm = ({
  categoryId,
  setIsAddOpen,
  isPending,
}: AddSubCareerFormProps) => {
  const { mutateAsync: addSubCareer, isPending: isAddPending } =
    useCreateSubCareer();
  const form = useForm<z.infer<typeof addSubCareerSchema>>({
    resolver: zodResolver(addSubCareerSchema),
    defaultValues: {
      subCategoryName: "",
      subNetProfit: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof addSubCareerSchema>) => {
    try {
      if (!categoryId) return;
      const payload = {
        ...data,
        subNetProfit: Number(data.subNetProfit),
        categoryId,
      };
      await addSubCareer(payload);
      form.reset();
      setIsAddOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Category Name */}
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
          onClick={() => setIsAddOpen(false)}
          disabled={isPending || isAddPending}
          className="cursor-pointer"
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          disabled={isPending || isAddPending}
          className="cursor-pointer"
        >
          {isAddPending ? <Spinner className="size-4 mr-2" /> : null}
          บันทึกข้อมูล
        </Button>
      </div>
    </form>
  );
};

export default AddSubCareerForm;
