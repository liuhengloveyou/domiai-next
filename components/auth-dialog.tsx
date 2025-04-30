/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useLanguage } from "@/lib/i18n/language-context";
import { Github, Chrome, Loader2 } from "lucide-react";
// import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

import { z } from "zod";

export const SignupFormSchema = z.object({
  cellphone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, { message: "请输入有效的手机号码" })
    .trim(),
  password: z
    .string()
    .min(6, { message: "密码长度至少为8个字符" })
    // .regex(/[a-zA-Z]/, { message: "密码需包含至少一个字母" })
    // .regex(/[0-9]/, { message: "密码需包含至少一个数字" })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "密码需包含至少一个特殊字符",
    // })
    .trim(),
});

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleSwitchToRegister = () => {
      setIsLogin(false);
    };

    document.addEventListener("switch-to-register", handleSwitchToRegister);
    return () => {
      document.removeEventListener(
        "switch-to-register",
        handleSwitchToRegister
      );
    };
  }, []);

  // 当对话框关闭时重置为登录状态
  useEffect(() => {
    if (!isOpen) {
      setIsLogin(true);
    }
  }, [isOpen]);

  // 登录逻辑
  const handleLogin = async (cellphone: string, password: string) => {
    const result = await signIn("credentials", {
      redirect: false,
      cellphone,
      password,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    toast(t("welcomeBack"));

    onClose();
  };

  // 注册逻辑
  const handleRegister = async (cellphone: string, password: string) => {
    const response = await fetch("/usercenter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API": "user/register",
      },
      body: JSON.stringify({
        cellphone,
        password,
      }),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.error || t("registerError"));
    }

    console.log(responseData);
    if (responseData.code !== 0) {
      toast(responseData.msg);
      return;
    }

    // 注册成功后自动登录
    const loginResult = await signIn("credentials", {
      redirect: false,
      cellphone,
      password,
    });

    if (loginResult?.error) {
      throw new Error(loginResult.error);
    }

    toast(t("welcomeBack"));

    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const cellphone = formData.get("cellphone") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (!isLogin && password !== confirmPassword) {
        toast(t("passwordMismatch"));
        return;
      }

      // Validate form fields
      const validatedFields = SignupFormSchema.safeParse({
        cellphone: cellphone,
        password: password,
      });

      // If any form fields are invalid, return early
      if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        if (errors.cellphone) {
          toast.error(errors.cellphone[0]);
        } else if (errors.password) {
          toast.error(errors.password[0]);
        }
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        handleLogin(cellphone, password);
      } else {
        handleRegister(cellphone, password);
      }
    } catch (error: any) {
      console.error("认证错误:", error);
      toast(error.message || t("authError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            {isLogin ? t("login") : t("register")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLogin ? t("loginDescription") : t("registerDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cellphone">{t("cellphone")}</Label>
            <Input
              id="cellphone"
              name="cellphone"
              type="cellphone"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={isLoading}
            />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
            )}
            {isLogin ? t("login") : t("register")}
          </Button>
          <div className="text-center text-sm mt-4">
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
            >
              {isLogin ? t("noAccount") : t("haveAccount")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
