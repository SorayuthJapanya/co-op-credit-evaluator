import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useLoginUser } from "@/hooks/useAuth";
import { Spinner } from "../ui/spinner";
import { useNavigate } from "react-router-dom";

const loginFormSchema = z.object({
  username: z.string().min(13, "กรุณากรอกเลขบัตรประชาชน 13 หลัก"),
  password: z.string().min(5, "กรุณากรอกรหัสผ่าน"),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: login, isPending: loginPending } = useLoginUser();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    await login(data);
    form.reset();
    navigate("/");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Username Field */}
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="username">
                <p className="text-sm sm:text-base">
                  เลขบัตรประชาชน{" "}
                  <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>
              <Input
                {...field}
                id="username"
                aria-invalid={fieldState.invalid}
                placeholder="ตย. 1506611478952"
                className="placeholder:text-sm"
              />
              {fieldState.error && (
                <FieldError className="text-sm sm:text-base font-medium">
                  {fieldState.error.message}
                </FieldError>
              )}
            </Field>
          )}
        />

        {/* Password Field */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="password">
                <p className="text-sm sm:text-base">
                  รหัสผ่าน <span className="text-destructive ml-1">*</span>
                </p>
              </FieldLabel>

              {/* Relative container for Input + Button */}
              <div className="relative">
                <Input
                  {...field}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  aria-invalid={fieldState.invalid}
                  placeholder="รหัสผ่าน"
                  className="placeholder:text-sm pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute p-2 hover:bg-gray-100 rounded-full duration-200 cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {fieldState.error && (
                <FieldError className="text-sm sm:text-base font-medium">
                  {fieldState.error.message}
                </FieldError>
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        disabled={loginPending}
        className="w-full mt-4 cursor-pointer duration-200"
      >
        {loginPending ? <Spinner className="size-6" /> : "เข้าสู่ระบบ"}
      </Button>
    </form>
  );
};

export default LoginForm;
