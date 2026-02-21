import { Plus, Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError } from "./ui/field";
import { Input } from "./ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "./ui/spinner";
import { useCreateCareerCategory } from "@/hooks/useCareerCategory";

interface ActionCareerCategoryProps {
  searchTerm: string;
  onSearchTermChange: (searchTerm: string) => void;
  isAddOpen: boolean;
  setIsAddOpen: (isAddOpen: boolean) => void;
  isPending: boolean;
}

const addCareerCategorySchema = z.object({
  categoryName: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่อาชีพ"),
});

const ActionCareerCategory = ({
  searchTerm,
  onSearchTermChange,
  isAddOpen,
  setIsAddOpen,
  isPending,
}: ActionCareerCategoryProps) => {
  const { mutateAsync: addCareerCategory, isPending: isAddPending } =
    useCreateCareerCategory();
  const form = useForm<z.infer<typeof addCareerCategorySchema>>({
    resolver: zodResolver(addCareerCategorySchema),
    defaultValues: {
      categoryName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof addCareerCategorySchema>) => {
    try {
      await addCareerCategory(data);
      form.reset();
      setIsAddOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex items-center gap-2">
      {/* Search Term */}
      <InputGroup className="w-full max-w-sm">
        <InputGroupInput
          placeholder="ค้นหา..."
          name="searchTerm"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
        <InputGroupAddon className="cursor-pointer">
          <Search />
        </InputGroupAddon>
      </InputGroup>

      {/* Add new category */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button className="cursor-pointer">
            <Plus /> เพิ่มหมวดหมู่
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-auto max-h-[90vh] sm:max-w-sm w-full z-70 [&>button]:size-8 [&>button]:p-2 [&>button]:rounded-full [&>button]:hover:bg-primary/10 [&>button]:hover:text-primary [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:duration-200 [&>button]:transition-colors">
          <DialogHeader>
            <DialogTitle className="text-2xl">เพิ่มหมวดหมู่</DialogTitle>
          </DialogHeader>

          {/* add form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionCareerCategory;
