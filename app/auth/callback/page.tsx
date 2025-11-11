"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/profile");
      else router.push("/auth/login");
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg text-slate-700">
      Finishing sign-in...
    </div>
  );
}
