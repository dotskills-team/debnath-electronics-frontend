/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  UserX,
  Key,
  CreditCard,
  Search,
  X,
  FilePenLine,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  Power,
  PowerOff,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllUsersQuery,
  useToggleSubscriptionAccessMutation,
  useUpdateUserSubscriptionMutation,
  useDeleteUserMutation,
  useGetSingleUserQuery,
} from "@/redux/features/user/user.api";
import { useAdminChangePasswordMutation } from "@/redux/features/auth/auth.api";
import { useGetAllPlansQuery } from "@/redux/features/plan/plan.api";
import {
  useRegisterMutation,
  useUpdateUserMutation,
} from "@/redux/features/user/user.api";
import { IUser, IPlan, Role, IsActive } from "@/types/plan";
import {
  createUserSchema,
  updateUserSchema,
  assignPlanSchema,
  changePasswordSchema,
  CreateUserFormValues,
  UpdateUserFormValues,
  AssignPlanFormValues,
  ChangePasswordFormValues,
} from "@/utils/plan-schema";
import {
  RoleBadge,
  ActiveStatusBadge,
  SubscriptionBadge,
  EmptyState,
  TableSkeleton,
  ErrorState,
  ConfirmDeleteDialog,
} from "@/components/dashboard/shared/UiPrimitives";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const inputCls =
  "h-9 rounded-lg border-gray-200 bg-gray-50/60 text-sm focus:border-amber-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-amber-500 dark:focus:bg-gray-800 transition-colors";

const LabelCls =
  "text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400";

function SubmitBtn({
  loading,
  label,
  loadingLabel,
  form,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
  form: string;
}) {
  return (
    <button
      type="submit"
      form={form}
      disabled={loading}
      className={cn(
        "group relative overflow-hidden inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white",
        "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600",
        "transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]"
      />
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {loadingLabel}
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <FilePenLine className="h-3.5 w-3.5" />
          {label}
        </span>
      )}
    </button>
  );
}

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
  const [register, { isLoading }] = useRegisterMutation();
  const [updateSub] = useUpdateUserSubscriptionMutation();
  const { data: plansData } = useGetAllPlansQuery({});
  const plans: IPlan[] = (plansData?.data as any) ?? [];

  const {
    register: reg,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema as any),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: Role.ADMIN,
    },
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const onSubmit = async (data: CreateUserFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (
          k !== "planId" &&
          k !== "durationInDays" &&
          k !== "customPrice" &&
          v !== undefined
        )
          formData.append(k, String(v));
      });
      const res: any = await register(formData).unwrap();
      const userId = res?.data?._id;

      if (userId && data.planId) {
        await updateSub({
          id: userId,
          planId: data.planId,
          durationInDays: data.durationInDays,
          customPrice: data.customPrice,
        }).unwrap();
      }

      toast.success("User created successfully");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create user");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-xl gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500" />
        <DialogHeader className="flex-row items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <Plus className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
            Create New User
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <form
            id="create-user-form"
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-5 space-y-5"
          >
            {/* Basic Info */}
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
                <User className="h-3 w-3 text-amber-500" />
                Basic Information
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className={LabelCls}>Name *</Label>
                  <Input
                    {...reg("name")}
                    placeholder="Full name"
                    className={inputCls}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className={LabelCls}>Email *</Label>
                  <Input
                    {...reg("email")}
                    type="email"
                    placeholder="email@example.com"
                    className={inputCls}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className={LabelCls}>Password *</Label>
                  <Input
                    {...reg("password")}
                    type="password"
                    placeholder="••••••"
                    className={inputCls}
                  />
                  {errors.password && (
                    <p className="text-[11px] text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className={LabelCls}>Phone</Label>
                  <Input
                    {...reg("phone")}
                    placeholder="01XXXXXXXXX"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className={LabelCls}>Address *</Label>
                  <Input
                    {...reg("address")}
                    placeholder="House, Road, City"
                    className={inputCls}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className={LabelCls}>Role *</Label>
                  <Select
                    value={watch("role")}
                    onValueChange={(v) => setValue("role", v as Role)}
                  >
                    <SelectTrigger className={cn(inputCls, "w-full")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Role)
                        .filter(
                          (r) => r !== Role.SUPER_ADMIN && r !== Role.CUSTOMER,
                        )
                        .map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                <CreditCard className="h-3 w-3 text-amber-500" />
                Assign Subscription (Optional)
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className={LabelCls}>Plan</Label>
                  <Select
                    value={watch("planId") ?? ""}
                    onValueChange={(v) => setValue("planId", v)}
                  >
                    <SelectTrigger className={cn(inputCls, "w-full")}>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No plan</SelectItem>
                      {plans.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name} — ৳{p.price} / {p.durationInDays}d
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {watch("planId") && (
                  <>
                    <div className="space-y-1.5">
                      <Label className={LabelCls}>
                        Duration Override (days)
                      </Label>
                      <Input
                        type="number"
                        {...reg("durationInDays")}
                        placeholder="Leave blank for plan default"
                        className={inputCls}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className={LabelCls}>Custom Price (৳)</Label>
                      <Input
                        type="number"
                        {...reg("customPrice")}
                        placeholder="Leave blank for plan price"
                        className={inputCls}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="border-t border-gray-100 px-6 py-4 dark:border-gray-800 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <SubmitBtn
            loading={isLoading}
            label="Create User"
            loadingLabel="Creating…"
            form="create-user-form"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: IUser | null;
}

export function EditUserModal({
  open,
  onOpenChange,
  user,
}: EditUserModalProps) {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (user && open) {
      reset({
        name: user.name,
        phone: user.phone ?? "",
        address: user.address,
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user, open, reset]);

  const onSubmit = async (data: UpdateUserFormValues) => {
    if (!user) return;
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined) fd.append(k, String(v));
      });
      await updateUser({ id: user._id, data: fd }).unwrap();
      toast.success("User updated successfully");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update user");
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-md gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500" />
        <DialogHeader className="flex-row items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <Edit className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold">Edit User</DialogTitle>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </DialogHeader>

        <form
          id="edit-user-form"
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 py-5 space-y-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className={LabelCls}>Name</Label>
              <Input {...register("name")} className={inputCls} />
              {errors.name && (
                <p className="text-[11px] text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className={LabelCls}>Phone</Label>
              <Input {...register("phone")} className={inputCls} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className={LabelCls}>Address</Label>
              <Input {...register("address")} className={inputCls} />
              {errors.address && (
                <p className="text-[11px] text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className={LabelCls}>Role</Label>
              <Select
                value={watch("role")}
                onValueChange={(v) => setValue("role", v as Role)}
              >
                <SelectTrigger className={cn(inputCls, "w-full")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Role)
                    .filter(
                      (r) => r !== Role.SUPER_ADMIN && r !== Role.CUSTOMER,
                    )
                    .map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className={LabelCls}>Account Status</Label>
              <Select
                value={watch("isActive")}
                onValueChange={(v) => setValue("isActive", v as IsActive)}
              >
                <SelectTrigger className={cn(inputCls, "w-full")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IsActive).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>

        <DialogFooter className="border-t border-gray-100 px-6 py-4 dark:border-gray-800 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <SubmitBtn
            loading={isLoading}
            label="Save Changes"
            loadingLabel="Saving…"
            form="edit-user-form"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AssignPlanModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: IUser | null;
}

export function AssignPlanModal({
  open,
  onOpenChange,
  user,
}: AssignPlanModalProps) {
  const [updateSub, { isLoading }] = useUpdateUserSubscriptionMutation();
  const { data: plansData } = useGetAllPlansQuery({});
  const plans: IPlan[] = (plansData?.data as any) ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssignPlanFormValues>({
    resolver: zodResolver(assignPlanSchema as any),
    defaultValues: {
      planId: "",
      durationInDays: undefined,
      customPrice: undefined,
    },
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const onSubmit = async (data: AssignPlanFormValues) => {
    if (!user) return;
    try {
      await updateSub({ id: user._id, ...data }).unwrap();
      toast.success("Subscription assigned successfully");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign subscription");
    }
  };

  if (!user) return null;

  const selectedPlan = plans.find((p) => p._id === watch("planId"));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
        <div className="h-1 w-full bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <DialogHeader className="flex-row items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
            <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold">
              Assign Subscription
            </DialogTitle>
            <p className="text-xs text-gray-400">{user.name}</p>
          </div>
        </DialogHeader>

        <form
          id="assign-plan-form"
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 py-5 space-y-4"
        >
          <div className="space-y-1.5">
            <Label className={LabelCls}>Select Plan *</Label>
            <Select
              value={watch("planId")}
              onValueChange={(v) => setValue("planId", v)}
            >
              <SelectTrigger className={cn(inputCls, "w-full")}>
                <SelectValue placeholder="Choose a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name} — ৳{p.price} / {p.durationInDays} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.planId && (
              <p className="text-[11px] text-red-500">
                {errors.planId.message}
              </p>
            )}
          </div>

          {selectedPlan && (
            <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-3 dark:border-emerald-900/30 dark:bg-emerald-900/10 space-y-1">
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {selectedPlan.name}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                ৳{selectedPlan.price} · {selectedPlan.durationInDays} days
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className={LabelCls}>Override Duration (days)</Label>
              <Input
                type="number"
                {...register("durationInDays")}
                placeholder="Plan default"
                min={1}
                onWheel={(e) => e.currentTarget.blur()}
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <Label className={LabelCls}>Custom Price (৳)</Label>
              <Input
                type="number"
                {...register("customPrice")}
                placeholder="Plan price"
                min={0}
                onWheel={(e) => e.currentTarget.blur()}
                className={inputCls}
              />
            </div>
          </div>
        </form>

        <DialogFooter className="border-t border-gray-100 px-6 py-4 dark:border-gray-800 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <button
            type="submit"
            form="assign-plan-form"
            disabled={isLoading}
            className="group relative overflow-hidden inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Assigning…
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                Assign Plan
              </span>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string | null;
}

export function ChangePasswordModal({
  open,
  onOpenChange,
  userId,
}: ChangePasswordModalProps) {
  const [changePassword, { isLoading }] = useAdminChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (!userId) return;
    try {
      await changePassword({ userId, newPassword: data.newPassword }).unwrap();
      toast.success("Password changed successfully");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
        <div className="h-1 w-full bg-linear-to-r from-violet-500 via-purple-500 to-indigo-500" />
        <DialogHeader className="flex-row items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-900/20">
            <Key className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
          <DialogTitle className="text-base font-bold">
            Change Password
          </DialogTitle>
        </DialogHeader>

        <form
          id="change-password-form"
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 py-5 space-y-4"
        >
          <div className="space-y-1.5">
            <Label className={LabelCls}>New Password *</Label>
            <Input
              type="password"
              {...register("newPassword")}
              placeholder="Min 6 characters"
              className={inputCls}
            />
            {errors.newPassword && (
              <p className="text-[11px] text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className={LabelCls}>Confirm Password *</Label>
            <Input
              type="password"
              {...register("confirmPassword")}
              placeholder="Repeat password"
              className={inputCls}
            />
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </form>

        <DialogFooter className="border-t border-gray-100 px-6 py-4 dark:border-gray-800 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <button
            type="submit"
            form="change-password-form"
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving…
              </span>
            ) : (
              <>
                <Key className="h-3.5 w-3.5" />
                Update Password
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface UserDetailsModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string | null;
}

export function UserDetailsModal({
  open,
  onOpenChange,
  userId,
}: UserDetailsModalProps) {
  const { data, isLoading } = useGetSingleUserQuery(userId!, { skip: !userId });
  const user: IUser | undefined = data?.data as any;

  const rows = user
    ? [
        { icon: Mail, label: "Email", value: user.email },
        { icon: Phone, label: "Phone", value: user.phone ?? "—" },
        { icon: MapPin, label: "Address", value: user.address },
        { icon: Shield, label: "Role", value: <RoleBadge role={user.role} /> },
        {
          icon: User,
          label: "Account Status",
          value: <ActiveStatusBadge status={user.isActive} />,
        },
        {
          icon: CreditCard,
          label: "Subscription",
          value: (
            <SubscriptionBadge
              access={user.subscriptionAccess}
              expireAt={user.subscriptionExpireAt}
            />
          ),
        },
        {
          icon: Calendar,
          label: "Expires",
          value: user.subscriptionExpireAt
            ? format(new Date(user.subscriptionExpireAt), "PPp")
            : "—",
        },
        {
          icon: Calendar,
          label: "Last Login",
          value: user.lastLoginAt
            ? format(new Date(user.lastLoginAt), "PPp")
            : "—",
        },
        {
          icon: Calendar,
          label: "Joined",
          value: user.createdAt ? format(new Date(user.createdAt), "PPp") : "—",
        },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
        <div className="h-1 w-full bg-linear-to-r from-blue-500 via-cyan-500 to-teal-500" />

        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-amber-300 border-t-amber-600" />
          </div>
        ) : user ? (
          <>
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-amber-50 dark:bg-amber-900/20">
                {user.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-6 w-6 text-amber-400" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-50">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>

            <ScrollArea className="max-h-[60vh]">
              <div className="px-6 py-4 space-y-3">
                {rows.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 rounded-lg bg-gray-50/60 px-3 py-2.5 dark:bg-gray-800/40"
                  >
                    <Icon className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        {label}
                      </p>
                      <div className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="p-8 text-center text-sm text-gray-400">
            User not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function UsersManagementAccess() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [detailsUserId, setDetailsUserId] = useState<string | null>(null);
  const [assignPlanUser, setAssignPlanUser] = useState<IUser | null>(null);
  const [changePasswordUserId, setChangePasswordUserId] = useState<
    string | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [toggleSubscription, { isLoading: isToggling }] =
    useToggleSubscriptionAccessMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [search]);

  const { data, isLoading, error } = useGetAllUsersQuery({
    page,
    limit,
    ...(debouncedSearch && { searchTerm: debouncedSearch }),
  });

  const users: IUser[] = (data?.data as any) ?? [];
  const totalPages = data?.meta?.totalPage ?? 1;
  const total = data?.meta?.total ?? 0;

  const handleToggleSubscription = async (user: IUser) => {
    try {
      await toggleSubscription({
        id: user._id,
        subscriptionAccess: !user.subscriptionAccess,
      }).unwrap();
      toast.success(
        `Subscription ${!user.subscriptionAccess ? "enabled" : "disabled"}`,
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle subscription");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget).unwrap();
      toast.success("User deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  if (error) return <ErrorState message="Failed to load users" />;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 pr-8 rounded-lg border-gray-200 bg-gray-50/60 text-sm focus:border-amber-400 dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-amber-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
            {total} user{total !== 1 ? "s" : ""}
          </span>
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all duration-200 active:scale-95"
          >
            <Plus className="h-4 w-4" /> New User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900">
        {isLoading ? (
          <TableSkeleton rows={8} />
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="Try adjusting your search filters"
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-amber-100/80 bg-amber-50/50 dark:border-amber-900/20 dark:bg-amber-900/5 hover:bg-transparent">
                  {[
                    "User",
                    "Role",
                    "Subscription",
                    "Expires",
                    "Status",
                    "Access",
                    "Actions",
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="text-[10px] font-bold uppercase tracking-widest text-amber-700/60 dark:text-amber-500/60 px-4"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, idx) => (
                  <TableRow
                    key={user._id}
                    className={cn(
                      "border-b border-gray-100/80 dark:border-gray-800/60 transition-colors duration-100 hover:bg-amber-50/30 dark:hover:bg-amber-900/10",
                      idx % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-amber-50/10 dark:bg-amber-900/5",
                    )}
                  >
                    {/* User */}
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-amber-50 dark:bg-amber-900/20">
                          {user.picture ? (
                            <Image
                              src={user.picture}
                              alt={user.name}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <User className="h-4 w-4 text-amber-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-50 max-w-32">
                            {user.name}
                          </p>
                          <p className="truncate text-[11px] text-gray-400 max-w-32">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell className="px-4 py-3">
                      <RoleBadge role={user.role} />
                    </TableCell>

                    {/* Subscription */}
                    <TableCell className="px-4 py-3">
                      <SubscriptionBadge
                        access={user.subscriptionAccess}
                        expireAt={user.subscriptionExpireAt}
                      />
                    </TableCell>

                    {/* Expires */}
                    <TableCell className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                      {user.subscriptionExpireAt
                        ? format(
                            new Date(user.subscriptionExpireAt),
                            "MMM d, yyyy",
                          )
                        : "—"}
                    </TableCell>

                    {/* Account Status */}
                    <TableCell className="px-4 py-3">
                      <ActiveStatusBadge status={user.isActive} />
                    </TableCell>

                    {/* Subscription Toggle */}
                    <TableCell className="px-4 py-3">
                      <Switch
                        checked={!!user.subscriptionAccess}
                        onCheckedChange={() => handleToggleSubscription(user)}
                        disabled={isToggling}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-xl text-gray-400 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-xl"
                        >
                          <DropdownMenuItem
                            onClick={() => setDetailsUserId(user._id)}
                            className="gap-2 cursor-pointer text-sm"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEditUser(user)}
                            className="gap-2 cursor-pointer text-sm"
                          >
                            <Edit className="h-3.5 w-3.5" /> Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setAssignPlanUser(user)}
                            className="gap-2 cursor-pointer text-sm"
                          >
                            <CreditCard className="h-3.5 w-3.5" /> Assign Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setChangePasswordUserId(user._id)}
                            className="gap-2 cursor-pointer text-sm"
                          >
                            <Key className="h-3.5 w-3.5" /> Change Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleSubscription(user)}
                            className="gap-2 cursor-pointer text-sm"
                          >
                            {user.subscriptionAccess ? (
                              <>
                                <PowerOff className="h-3.5 w-3.5 text-orange-500" />{" "}
                                Disable Subscription
                              </>
                            ) : (
                              <>
                                <Power className="h-3.5 w-3.5 text-emerald-500" />{" "}
                                Enable Subscription
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(user._id)}
                            className="gap-2 cursor-pointer text-sm text-red-600 focus:text-red-600 dark:text-red-400"
                          >
                            <UserX className="h-3.5 w-3.5" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage((p) => p - 1)}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:text-amber-600"
                  }
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => setPage(p)}
                      isActive={page === p}
                      className={cn(
                        "cursor-pointer",
                        page === p &&
                          "border-amber-400 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-900/20",
                      )}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage((p) => p + 1)}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:text-amber-600"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modals */}
      <CreateUserModal open={createOpen} onOpenChange={setCreateOpen} />
      <EditUserModal
        open={!!editUser}
        onOpenChange={(v) => !v && setEditUser(null)}
        user={editUser}
      />
      <UserDetailsModal
        open={!!detailsUserId}
        onOpenChange={(v) => !v && setDetailsUserId(null)}
        userId={detailsUserId}
      />
      <AssignPlanModal
        open={!!assignPlanUser}
        onOpenChange={(v) => !v && setAssignPlanUser(null)}
        user={assignPlanUser}
      />
      <ChangePasswordModal
        open={!!changePasswordUserId}
        onOpenChange={(v) => !v && setChangePasswordUserId(null)}
        userId={changePasswordUserId}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete this user?"
        description="This will permanently delete the user and all associated data."
      />
    </div>
  );
}
