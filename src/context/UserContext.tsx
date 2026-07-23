"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { logoutUser } from "@/utils/logoutUser";
import { usePathname, useRouter } from "next/navigation";

type User = {
  _id: string;
  email: string;
  role: "SUPER_ADMIN" | "CUSTOMER" | "MODERATOR" | "MANAGER" | "ADMIN";
};

type UserContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (!currentUser && pathname.startsWith("/staff/dashboard")) {
          await logoutUser();
          router.replace("/login");
          return;
        }

        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    };

    hydrateUser();
  }, [pathname, router]);

  const login = (userData: User) => setUser(userData);

  const logout = async () => {
    await logoutUser();
    setUser(null);
    router.replace("/login");
  };

  if (loading) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
