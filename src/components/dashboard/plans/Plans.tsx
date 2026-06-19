/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Check,
  X,
  Zap,
  Clock,
  Users,
  DollarSign,
  FilePenLine,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetAllPlansQuery,
} from "@/redux/features/plan/plan.api";
import { IPlan, PlanStatus } from "@/types";
import { createPlanSchema, CreatePlanFormValues } from "@/utils/plan-schema";
import {
  PlanStatusBadge,
  EmptyState,
  ConfirmDeleteDialog,
  ErrorState,
} from "@/components/dashboard/shared/UiPrimitives";
import { cn } from "@/lib/utils";

const inputCls =
  "h-9 rounded-lg border-gray-200 bg-gray-50/60 text-sm focus:border-amber-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-amber-500 dark:focus:bg-gray-800 transition-colors";

function FeatureTagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const remove = (feat: string) => {
    onChange(value.filter((f) => f !== feat));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Add a feature and press Enter"
          className={inputCls}
        />
        <Button type="button" size="sm" variant="outline" onClick={add} className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((feat) => (
            <Badge
              key={feat}
              variant="outline"
              className="gap-1 rounded-full border-amber-200 bg-amber-50 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
            >
              <Check className="h-3 w-3" />
              {feat}
              <button type="button" onClick={() => remove(feat)} className="ml-0.5 hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

interface PlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: IPlan | null;
}

export function PlanFormModal({ open, onOpenChange, initialData }: PlanFormProps) {
  const isEdit = !!initialData;
  const [features, setFeatures] = useState<string[]>([]);
  const [createPlan, { isLoading: isCreating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePlanFormValues>({
    resolver: zodResolver(createPlanSchema as any),
    defaultValues: {
      name: "",
      slug: "",
      price: 0,
      durationInDays: 30,
      description: "",
      maxUsers: 1,
      status: PlanStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name,
          slug: initialData.slug,
          price: initialData.price,
          durationInDays: initialData.durationInDays,
          description: initialData.description ?? "",
          maxUsers: initialData.maxUsers ?? 1,
          status: initialData.status,
        });
        setFeatures(initialData.features ?? []);
      } else {
        reset({ name: "", slug: "", price: 0, durationInDays: 30, description: "", maxUsers: 1, status: PlanStatus.ACTIVE });
        setFeatures([]);
      }
    }
  }, [open, initialData, reset]);

  const nameValue = watch("name");
  useEffect(() => {
    if (!isEdit) {
      setValue("slug", nameValue.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  }, [nameValue, isEdit, setValue]);

  const onSubmit = async (data: CreatePlanFormValues) => {
    try {
      const payload = { ...data, features };
      if (isEdit && initialData) {
        await updatePlan({ id: initialData._id, data: payload }).unwrap();
        toast.success("Plan updated successfully");
      } else {
        await createPlan(payload).unwrap();
        toast.success("Plan created successfully");
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save plan");
    }
  };

  const LabelCls = "text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-xl gap-0 p-0 overflow-hidden rounded-2xl border-gray-200/80 dark:border-gray-700/60">
        <div className="h-1 w-full bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500" />
        <DialogHeader className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-50">
            {isEdit ? "Edit Plan" : "Create New Plan"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <form id="plan-form" onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className={LabelCls}>Plan Name *</Label>
                <Input {...register("name")} placeholder="e.g., Basic Plan" className={inputCls} />
                {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className={LabelCls}>Slug *</Label>
                <Input {...register("slug")} placeholder="e.g., basic-plan" className={inputCls} />
                {errors.slug && <p className="text-[11px] text-red-500">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className={LabelCls}>Price (৳) *</Label>
                <Input type="number" {...register("price")} placeholder="0" min={0} onWheel={(e) => e.currentTarget.blur()} className={inputCls} />
                {errors.price && <p className="text-[11px] text-red-500">{errors.price.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className={LabelCls}>Duration (Days) *</Label>
                <Input type="number" {...register("durationInDays")} placeholder="30" min={1} onWheel={(e) => e.currentTarget.blur()} className={inputCls} />
                {errors.durationInDays && <p className="text-[11px] text-red-500">{errors.durationInDays.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className={LabelCls}>Max Users</Label>
                <Input type="number" {...register("maxUsers")} placeholder="1" min={1} onWheel={(e) => e.currentTarget.blur()} className={inputCls} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className={LabelCls}>Description</Label>
              <Textarea {...register("description")} placeholder="Describe this plan…" rows={2} className={cn(inputCls, "h-auto resize-none")} />
            </div>

            <div className="space-y-1.5">
              <Label className={LabelCls}>Features</Label>
              <FeatureTagInput value={features} onChange={setFeatures} />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/40">
              <Switch
                id="plan-status"
                checked={watch("status") === PlanStatus.ACTIVE}
                onCheckedChange={(checked) =>
                  setValue("status", checked ? PlanStatus.ACTIVE : PlanStatus.INACTIVE)
                }
              />
              <Label htmlFor="plan-status" className="cursor-pointer text-sm font-medium">
                Plan is {watch("status") === PlanStatus.ACTIVE ? "Active" : "Inactive"}
              </Label>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="border-t border-gray-100 px-6 py-4 dark:border-gray-800 gap-2">
          <Button variant="outline" size="sm" className="rounded-lg" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <button
            type="submit"
            form="plan-form"
            disabled={isLoading}
            className={cn(
              "group relative overflow-hidden inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white",
              "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600",
              "transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]" />
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {isEdit ? "Updating…" : "Creating…"}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                {isEdit ? <FilePenLine className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {isEdit ? "Update Plan" : "Create Plan"}
              </span>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface PlanCardProps {
  plan: IPlan;
  onEdit: (plan: IPlan) => void;
  onDelete: (id: string) => void;
}

export function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300",
      "hover:-translate-y-0.5 hover:shadow-xl dark:bg-gray-900/80",
      plan.status === PlanStatus.ACTIVE
        ? "border-amber-200/60 dark:border-amber-800/40"
        : "border-gray-200 dark:border-gray-700/60",
    )}>
      <div className={cn(
        "h-1 w-full",
        plan.status === PlanStatus.ACTIVE
          ? "bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500"
          : "bg-gray-300 dark:bg-gray-700",
      )} />

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-50">{plan.name}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-mono">{plan.slug}</p>
          </div>
          <div className="flex items-center gap-2">
            <PlanStatusBadge status={plan.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => onEdit(plan)} className="gap-2 cursor-pointer text-sm">
                  <Edit className="h-3.5 w-3.5" /> Edit Plan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(plan._id)} className="gap-2 cursor-pointer text-sm text-red-600 focus:text-red-600 dark:text-red-400">
                  <Trash2 className="h-3.5 w-3.5" /> Disable Plan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {plan.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{plan.description}</p>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: DollarSign, label: "Price", value: `৳${plan.price.toLocaleString()}` },
            { icon: Clock, label: "Duration", value: `${plan.durationInDays}d` },
            { icon: Users, label: "Users", value: plan.maxUsers ?? "∞" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg bg-gray-50/80 dark:bg-gray-800/40 px-3 py-2 text-center">
              <Icon className="h-3.5 w-3.5 text-gray-400 mx-auto mb-1" />
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{label}</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{value}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        {(plan.features ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {(plan.features ?? []).slice(0, 4).map((f) => (
              <Badge key={f} variant="outline" className="text-[10px] rounded-full border-amber-200 bg-amber-50/60 text-amber-700 dark:border-amber-800 dark:bg-amber-900/10 dark:text-amber-400">
                <Zap className="h-2.5 w-2.5 mr-0.5" />{f}
              </Badge>
            ))}
            {(plan.features ?? []).length > 4 && (
              <Badge variant="outline" className="text-[10px] rounded-full text-gray-500">
                +{(plan.features ?? []).length - 4} more
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function PlansContent() {
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<IPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  const { data, isLoading, error } = useGetAllPlansQuery({ });
  const plans: IPlan[] = (data?.data as any) ?? [];

  const handleEdit = (plan: IPlan) => {
    setEditTarget(plan);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePlan(deleteTarget).unwrap();
      toast.success("Plan disabled");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to disable plan");
    }
  };

  if (error) return <ErrorState message="Failed to load plans" />;

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {plans.length} plan{plans.length !== 1 ? "s" : ""}
        </p>
        <Button
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
          className="gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all duration-200 active:scale-95"
        >
          <Plus className="h-4 w-4" /> New Plan
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-gray-200 dark:border-gray-700 h-56 bg-amber-50/40 dark:bg-amber-900/5" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No plans yet"
          description="Create your first subscription plan to get started"
          action={{ label: "Create Plan", onClick: () => setFormOpen(true) }}
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} onEdit={handleEdit} onDelete={(id) => setDeleteTarget(id)} />
          ))}
        </div>
      )}

      <PlanFormModal
        open={formOpen}
        onOpenChange={(v) => { setFormOpen(v); if (!v) setEditTarget(null); }}
        initialData={editTarget}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Disable this plan?"
        description="The plan will be marked inactive. Existing subscribers are not affected."
      />
    </>
  );
}