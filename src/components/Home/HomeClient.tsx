"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function HomeClient() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {

    if (user) {
      router.replace(
        user.role === "SUPER_ADMIN"
          ? "/staff/dashboard/admin"
          : "/staff/dashboard"
      );
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  return null;
}