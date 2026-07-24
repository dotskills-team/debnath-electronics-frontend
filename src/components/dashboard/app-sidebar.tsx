/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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

  const whatsappNumber = "8801872122544";
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

      <SidebarContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <SidebarGroup>
            <SidebarGroupLabel className="text-amber-700 dark:text-amber-400 font-semibold">
              {userRole === "ADMIN" ? "Admin Panel" : `${userRole} Access`}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item, idx) => {
                  const isActive = pathname === item.href;

                  return (
                    <SidebarMenuItem key={idx}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-amber-50 dark:hover:bg-amber-950/30 ${
                          isActive
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.href === "#logout" ? (
                          <button
                            type="button"
                            onClick={handleLinkClick}
                            className="w-full flex items-center gap-2"
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={handleLinkClick}
                            className="w-full flex items-center gap-2"
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

      <SidebarFooter className="border-t bg-background px-4 py-4">
        <div className="space-y-3 text-center">
          <div>
            <p className="text-[11px] text-muted-foreground">
              Powered by{" "}
              <Link
                href="https://dotskillsbd.com"
                target="_blank"
                className="font-semibold text-amber-600 transition-colors hover:text-amber-700"
              >
                DotSkills
              </Link>
            </p>
          </div>

          <div className="rounded-lg border border-amber-200/70 bg-amber-50/70 p-3 dark:border-amber-900 dark:bg-amber-950/20">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              📱 Support
            </p>

            <Link
              href={`https://wa.me/${whatsappNumber}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm font-semibold text-foreground transition-colors hover:text-amber-600"
            >
              +8801872-122544
            </Link>

            <div className="my-2 h-px bg-border" />

            <p className="text-[11px] font-semibold uppercase tracking-wide text-pink-600">
              💳 BKash Personal
            </p>

            <p className="mt-1 text-base font-bold tracking-wider text-pink-600">
              01872-122544
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">
              Send subscription payments to this bKash Personal number.
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
