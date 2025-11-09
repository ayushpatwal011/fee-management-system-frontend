import {  GraduationCap } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";
import { useAdminStore } from "@/store/useAdminStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { admin } = useAdminStore();
  const navigate = useNavigate();

  // 🟢 If already logged in, redirect to dashboard
  useEffect(() => {
    if (admin) {
      navigate("/dashboard");
    }
  }, [admin, navigate]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* ===== Left Section (Form) ===== */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo / Title */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GraduationCap className="size-4" />
            </div>
            Fees Management System
          </a>
        </div>

        {/* Login Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* ===== Right Section (Image) ===== */}
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/login.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
