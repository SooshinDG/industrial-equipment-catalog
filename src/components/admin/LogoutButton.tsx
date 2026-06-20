"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await createSupabaseBrowserClient().auth.signOut();
    } catch {
      // 무시: 어떤 경우든 로그인 화면으로 보낸다
    }
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="btn-secondary"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      로그아웃
    </button>
  );
}
