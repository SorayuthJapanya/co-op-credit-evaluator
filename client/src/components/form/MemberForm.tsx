import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import type { ICreateMemberRequest } from "@/types/member_types";
import { Spinner } from "../ui/spinner";
import { useCreateMember } from "@/hooks/useMember";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";

const memberFormSchema = z.object({
  cooperativeId: z.string().min(1, "กรุณากรอกรหัสสหกรณ์"),
  idCard: z.string().length(13, "กรุณากรอกเลขบัตรประชาชน 13 หลัก"),
  accountYear: z.string().min(1, "กรุณากรอกปีบัญชี"),
  memberId: z.string().min(1, "กรุณากรอกเลขทะเบียนสมาชิก"),
  fullName: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
  nationality: z.string().min(1, "กรุณากรอกสัญชาติ"),
  sharesNum: z.coerce.number().min(0, "จำนวนหุ้นต้องไม่ติดลบ"),
  sharesValue: z.coerce.number().min(0, "มูลค่าหุ้นต้องไม่ติดลบ"),
  joiningDate: z.string().min(1, "กรุณาเลือกวันที่เข้าเป็นสมาชิก"),
  memberType: z.coerce.number().min(1, "กรุณาเลือกประเภทสมาชิก"),
  leavingDate: z.string().optional(),
  address: z.string().min(1, "กรุณากรอกที่อยู่"),
  moo: z.string().optional(),
  subdistrict: z.string().min(1, "กรุณากรอกตำบล"),
  district: z.string().min(1, "กรุณากรอกอำเภอ"),
  province: z.string().min(1, "กรุณากรอกจังหวัด"),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

type MemberFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

const MemberForm = ({ onSuccess, onCancel }: MemberFormProps) => {
  const { mutateAsync: createMember, isPending } = useCreateMember();

  const form = useForm<MemberFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(memberFormSchema) as any,
    defaultValues: {
      cooperativeId: "",
      idCard: "",
      accountYear: new Date().getFullYear().toString(),
      memberId: "",
      fullName: "",
      nationality: "ไทย",
      sharesNum: 0,
      sharesValue: 0,
      joiningDate: new Date().toISOString().split("T")[0],
      memberType: 1,
      leavingDate: "",
      address: "",
      moo: "",
      subdistrict: "",
      district: "",
      province: "",
    },
  });

  const onSubmit = async (data: MemberFormValues) => {
    try {
      await createMember({
        ...data,
        sharesNum: Number(data.sharesNum),
        sharesValue: Number(data.sharesValue),
        memberType: Number(data.memberType),
      } as ICreateMemberRequest);
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cooperative ID */}
        <Controller
          name="cooperativeId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="cooperativeId">
                <p className="text-sm sm:text-base">
                  รหัสสหกรณ์ <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Input
                {...field}
                id="cooperativeId"
                aria-invalid={fieldState.invalid}
                placeholder="กรอกรหัสสหกรณ์"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Member ID */}
        <Controller
          name="memberId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="memberId">
                <p className="text-sm sm:text-base">
                  เลขทะเบียนสมาชิก{" "}
                  <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Input
                {...field}
                id="memberId"
                aria-invalid={fieldState.invalid}
                placeholder="กรอกเลขทะเบียนสมาชิก"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Full Name */}
        <Controller
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="md:col-span-2">
              <FieldLabel htmlFor="fullName">
                <p className="text-sm sm:text-base">
                  ชื่อ-นามสกุล <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Input
                {...field}
                id="fullName"
                aria-invalid={fieldState.invalid}
                placeholder="กรอกชื่อ-นามสกุล"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* ID Card */}
        <Controller
          name="idCard"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="idCard">
                <p className="text-sm sm:text-base">
                  เลขประจำตัวประชาชน{" "}
                  <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Input
                {...field}
                id="idCard"
                maxLength={13}
                aria-invalid={fieldState.invalid}
                placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Nationality */}
        <Controller
          name="nationality"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="nationality">
                <p className="text-sm sm:text-base">
                  สัญชาติ <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Input
                {...field}
                id="nationality"
                aria-invalid={fieldState.invalid}
                placeholder="กรอกสัญชาติ"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Account Year */}
        <Controller
          name="accountYear"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="accountYear">
                <p className="text-sm sm:text-base">
                  ปีบัญชี <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Input
                {...field}
                id="accountYear"
                type="number"
                aria-invalid={fieldState.invalid}
                placeholder="ปีบัญชี"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Member Type */}
        <Controller
          name="memberType"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="memberType">
                <p className="text-sm sm:text-base">
                  ประเภทสมาชิก <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Select
                value={field.value.toString()}
                onValueChange={(val) => field.onChange(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทสมาชิก" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">สมาชิกสามัญ</SelectItem>
                  <SelectItem value="2">สมาชิกสมทบ</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Joining Date */}
        <Controller
          name="joiningDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="flex flex-col flex-1 gap-2 mt-1">
              <FieldLabel htmlFor="joiningDate">
                <p className="text-sm sm:text-base">
                  วันที่เข้าเป็นสมาชิก{" "}
                  <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="joiningDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 px-3 py-2",
                      !field.value && "text-muted-foreground",
                      fieldState.invalid &&
                        "border-destructive text-destructive",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(new Date(field.value), "dd MMMM yyyy", {
                        locale: th,
                      })
                    ) : (
                      <span>เลือกวันที่</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                    }
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Leaving Date */}
        <Controller
          name="leavingDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="flex flex-col flex-1 gap-2 mt-1">
              <FieldLabel htmlFor="leavingDate">
                <p className="text-sm sm:text-base">วันที่ลาออก</p>
              </FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="leavingDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 px-3 py-2",
                      !field.value && "text-muted-foreground",
                      fieldState.invalid &&
                        "border-destructive text-destructive",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(new Date(field.value), "dd MMMM yyyy", {
                        locale: th,
                      })
                    ) : (
                      <span>เลือกวันที่</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                    }
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Shares Number */}
        <Controller
          name="sharesNum"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="sharesNum">
                <p className="text-sm sm:text-base">จำนวนหุ้น</p>
              </FieldLabel>
              <Input
                {...field}
                id="sharesNum"
                type="number"
                min="0"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Shares Value */}
        <Controller
          name="sharesValue"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="sharesValue">
                <p className="text-sm sm:text-base">มูลค่าหุ้นรวม</p>
              </FieldLabel>
              <Input
                {...field}
                id="sharesValue"
                type="number"
                min="0"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Address Fields */}
        <div className="md:col-span-2 text-lg font-semibold mt-4">
          ข้อมูลที่อยู่
        </div>

        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="address">
                <p className="text-sm sm:text-base">
                  บ้านเลขที่ <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Input
                {...field}
                id="address"
                aria-invalid={fieldState.invalid}
                placeholder="กรอกบ้านเลขที่, ถนน, ซอย"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="moo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="moo">
                <p className="text-sm sm:text-base">หมู่ที่</p>
              </FieldLabel>
              <Input
                {...field}
                id="moo"
                aria-invalid={fieldState.invalid}
                placeholder="กรอกหมู่ที่"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="subdistrict"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="subdistrict">
                <p className="text-sm sm:text-base">
                  ตำบล/แขวง <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Input
                {...field}
                id="subdistrict"
                aria-invalid={fieldState.invalid}
                placeholder="กรอกตำบล"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="district"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="district">
                <p className="text-sm sm:text-base">
                  อำเภอ/เขต <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Input
                {...field}
                id="district"
                aria-invalid={fieldState.invalid}
                placeholder="กรอกอำเภอ"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="province"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="province">
                <p className="text-sm sm:text-base">
                  จังหวัด <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Input
                {...field}
                id="province"
                aria-invalid={fieldState.invalid}
                placeholder="กรอกจังหวัด"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            ยกเลิก
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner className="size-4 mr-2" /> : null}
          บันทึกข้อมูล
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;
