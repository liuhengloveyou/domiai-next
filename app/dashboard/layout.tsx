"use client";

import { usePathname } from "next/navigation";

// 将 dynamic 配置移到 import 语句之后
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <div>
      <h2>i am DashboardLayout {pathname}</h2>
      {children}
    </div>
  );
}
