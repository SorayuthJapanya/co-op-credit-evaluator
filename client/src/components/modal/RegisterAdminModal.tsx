import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { createAdmin } from "@/services/superAdminService";
import Swal from "sweetalert2";

const formSchema = z.object({
  username: z.string().min(1, { message: "กรุณากรอกชื่อผู้ใช้งาน" }),
  fullname: z.string().min(1, { message: "กรุณากรอกชื่อ นามสกุล" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
  confirmPassword: z.string().min(1, { message: "กรุณายืนยันรหัสผ่านอีกครั้ง" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

interface RegisterAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RegisterAdminModal = ({ isOpen, onClose, onSuccess }: RegisterAdminModalProps) => {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullname: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsPending(true);
      await createAdmin({
        username: data.username,
        fullname: data.fullname,
        password: data.password,
      });
      
      reset();
      
      Swal.fire({
          icon: 'success',
          title: 'เพิ่มผู้ใช้งานสำเร็จ',
          timer: 1500,
          showConfirmButton: false
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire({
          icon: 'error',
          title: err.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้งาน',
      });
    } finally {
        setIsPending(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold border-b pb-4">เพิ่มผู้ใช้งานระบบ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          
          <Field data-invalid={!!errors.username}>
            <FieldLabel htmlFor="username">Username (ชื่อผู้ใช้)</FieldLabel>
            <Input
              id="username"
              {...register("username")}
              placeholder="กรอกชื่อผู้ใช้งาน"
            />
            {errors.username && <FieldError>{errors.username.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.fullname}>
            <FieldLabel htmlFor="fullname">ชื่อ - นามสกุล</FieldLabel>
            <Input
              id="fullname"
              {...register("fullname")}
              placeholder="กรอกชื่อ นามสกุล"
            />
            {errors.fullname && <FieldError>{errors.fullname.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">รหัสผ่าน</FieldLabel>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="กรอกรหัสผ่าน"
            />
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">ยืนยันรหัสผ่าน</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="กรอกรหัสผ่านอีกครั้ง"
            />
            {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
          </Field>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "กำลังบันทึก..." : "เพิ่มผู้ใช้งาน"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterAdminModal;
