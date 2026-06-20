import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Factory } from "lucide-react";
import { getAdminUser } from "@/lib/auth/admin";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  // 이미 관리자로 로그인되어 있으면 콘솔로 이동
  const admin = await getAdminUser();
  if (admin) {
    redirect("/admin/products");
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-sm border border-brand-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2.5 text-brand-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-brand-900 text-white">
            <Factory className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold">에어메이트 관리자</p>
            <p className="num text-[10px] font-medium tracking-tight text-brand-400">
              ADMIN CONSOLE
            </p>
          </div>
        </div>
        <h1 className="mt-6 text-lg font-bold text-brand-900">관리자 로그인</h1>
        <p className="mt-1 text-sm text-brand-500">
          허용된 관리자 계정만 접근할 수 있습니다.
        </p>
        <LoginForm />
        <p className="mt-6 border-t border-brand-200 pt-4 text-xs text-brand-400">
          포트폴리오 데모용 관리자 콘솔입니다.
        </p>
      </div>
    </div>
  );
}
