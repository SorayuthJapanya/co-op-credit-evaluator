import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import LoginForm from "@/components/form/LoginForm";
import RegisterForm from "@/components/form/RegisterForm";

const LoginPage = () => {
  const [type, setType] = useState<"login" | "register">("login");

  const handleToggleType = () => {
    setType(type === "login" ? "register" : "login");
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen p-4">
      <Card className="w-full sm:max-w-md shadow-md">
        {/* --- HEADER --- */}
        <CardHeader className="flex items-center gap-4">
          <img
            src="/credit-evaluator-icon.png"
            alt="credit-evaluator-icon"
            className="w-24 h-auto hover:scale-110 duration-300 transition-transform"
          />
          <CardTitle className="flex flex-col items-start text-primary text-2xl font-semibold">
            {type === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
            <p className="text-muted-foreground text-sm font-medium">ลงชื่อเข้าใช้งานก่อนเริ่มใช้งานระบบประเมินความสามารถในการชำระหนี้</p>   
          </CardTitle>
        </CardHeader>

        {/* --- CONTENT (The Form) --- */}
        <CardContent className="space-y-4">
          {type === "login" ? <LoginForm /> : <RegisterForm />}
        </CardContent>

        {/* --- FOOTER (The Toggle) --- */}
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            {type === "login" ? "ยังไม่มีบัญชีใช่ไหม? " : "มีบัญชีอยู่แล้ว? "}

            {/* THIS IS THE MISSING LOGIC */}
            <span
              onClick={handleToggleType}
              className="text-primary font-bold cursor-pointer hover:underline ml-1"
            >
              {type === "login" ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
