/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { usePathname } from "next/navigation";
import Image from "next/image";
import type { UserRole } from "@/lib/permissions";
import { buildSidebarItems } from "./user/buildSidebar";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data, isLoading, isError } = useUserInfoQuery(undefined);

  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Loading sidebar...
      </div>
    );
  }

  if (isError || !data?.data?.role) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 text-sm">
        Failed to load user info
      </div>
    );
  }

  const userRole = (data?.data?.role as UserRole) || "MODERATOR";
  const customPermissions = (data?.data?.permissions as any[]) || undefined;

  const sidebarItems = buildSidebarItems(userRole, customPermissions);

  const whatsappNumber = "8801568149801";
  const message = encodeURIComponent(
    `আসসালামু আলাইকুম,

আমি Debnath Electronics সফটওয়্যারের একজন ব্যবহারকারী।

আমার সাবস্ক্রিপশন সম্পর্কিত সহায়তা প্রয়োজন। অনুগ্রহ করে আমাকে সহযোগিতা করবেন।

ধন্যবাদ।`,
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader className="ml-5">
        <Link href="/" onClick={handleLinkClick}>
          <Image
            src={"/assets/debnath-electronics-logo.jpeg"}
            alt="Debnath Electronics Logo"
            width={500}
            height={500}
            quality={90}
            className="w-36 mx-auto h-20 rounded-md"
            priority
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="max-h-[90vh] pr-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-amber-700 dark:text-amber-400 font-semibold">
              {userRole === "ADMIN" ? "Admin Panel" : `${userRole} Access`}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem
                      key={idx}
                      className="transition-all duration-200"
                    >
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors ${
                          isActive
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.href === "#logout" ? (
                          <button
                            onClick={handleLinkClick}
                            className="w-full flex items-center gap-2"
                            type="button"
                            title={item.description}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={handleLinkClick}
                            className="w-full flex items-center gap-2"
                            title={item.description}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SidebarContent>

      <SidebarRail />

      <div className="mt-auto border-t border-border px-4 py-4 text-center">
        <p className="text-[11px] text-muted-foreground">
          Powered by{" "}
          <Link
            href="https://dotskillsbd.com"
            target="_blank"
            className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            DotSkills
          </Link>
        </p>

        <p className="mt-1 text-[11px] text-muted-foreground">
          📱Support:
          <Link
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            +8801568149801
          </Link>
        </p>
      </div>
    </Sidebar>
  );
}
