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

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (!isLogin && password !== confirmPassword) {
        toast(t("passwordMismatch"));
        return;
      }

      if (isLogin) {
        // 登录逻辑
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        toast(t("welcomeBack"));

        onClose();
      } else {
        // 注册逻辑
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || t("registerError"));
        }

        // 注册成功后自动登录
        const loginResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (loginResult?.error) {
          throw new Error(loginResult.error);
        }

        toast(t("welcomeBack"));

        onClose();
      }
    } catch (error: any) {
      console.error("认证错误:", error);
      toast(error.message || t("authError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setIsGithubLoading(true);
      await signIn("github", { callbackUrl: window.location.href });
    } catch (error) {
      toast(t("authError"));
    } finally {
      setIsGithubLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl: window.location.href });
    } catch (error) {
      toast( t("authError"));
    } finally {
      setIsGoogleLoading(false);
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
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full relative"
              onClick={handleGithubLogin}
              disabled={isGithubLoading || isGoogleLoading || isLoading}
            >
              {isGithubLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              {t("githubLogin")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full relative"
              onClick={handleGoogleLogin}
              disabled={isGithubLoading || isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Chrome className="mr-2 h-4 w-4" />
              )}
              {t("googleLogin")}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("dividerText")}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
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
