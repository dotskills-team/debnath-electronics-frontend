/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Copy,
  CheckCircle2,
  Upload,
  X,
  Loader2,
  PhoneCall,
  ShieldAlert,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateRenewRequestMutation } from "@/redux/features/subscriptionRenew/subscriptionRenew.api";
import { PaymentMethod } from "@/types/subscriptionRenew";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const COMPANY_BKASH_NUMBER = "01568149801";

const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
  emoji: string;
}[] = [
  { value: "BKASH", label: "bKash", emoji: "💜" },
  { value: "NAGAD", label: "Nagad", emoji: "🟠" },
  { value: "ROCKET", label: "Rocket", emoji: "💜" },
  { value: "BANK", label: "Bank Transfer", emoji: "🏦" },
];

const renewSchema = z.object({
  paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET", "BANK"] as const, {
    message: "পেমেন্ট পদ্ধতি নির্বাচন করুন",
  }),
  transactionId: z
    .string()
    .min(4, "ট্রানজেকশন আইডি অবশ্যই ৪ অক্ষরের বেশি হতে হবে")
    .max(100, "ট্রানজেকশন আইডি অনেক বড়"),
  email: z.string().optional(),
  paymentScreenshot: z.string().min(1, "পেমেন্ট স্ক্রিনশট আপলোড করুন"),
  note: z.string().optional(),
});

type RenewFormValues = z.infer<typeof renewSchema>;

interface SubscriptionExpiredModalProps {
  onBackToLogin: () => void;
  email?: string;
  customerName?: string;
}

export default function SubscriptionExpiredModal({
  onBackToLogin,
  email,
}: SubscriptionExpiredModalProps) {
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [createRenewRequest, { isLoading }] = useCreateRenewRequestMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RenewFormValues>({
    resolver: zodResolver(renewSchema),
    defaultValues: {
      paymentMethod: undefined,
      transactionId: "",
      paymentScreenshot: "",
      email,
      note: "",
    },
  });

  const paymentScreenshot = watch("paymentScreenshot");

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(COMPANY_BKASH_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("ফাইল সাইজ ৫ MB-এর বেশি হতে পারবে না");
        return;
      }

      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewUrl(base64);
        setValue("paymentScreenshot", base64, { shouldValidate: true });
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    },
    [setValue],
  );

  const removeImage = useCallback(() => {
    setPreviewUrl(null);
    setValue("paymentScreenshot", "", { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (data: RenewFormValues) => {
    try {
      await createRenewRequest(data).unwrap();
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(
        error?.data?.message ??
          "রিনিউ রিকোয়েস্ট পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।",
      );
    }
  };

  if (submitted) {
    return (
      <ModalWrapper>
        <div className="flex flex-col items-center justify-center gap-6 py-10 px-6 text-center">
          {/* Success illustration */}
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20 ring-8 ring-emerald-100 dark:ring-emerald-900/30">
              <CheckCircle2 className="h-14 w-14 text-emerald-500" />
            </div>
            <span className="absolute -right-1 -top-1 text-2xl">🎉</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে!
            </h2>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              আপনার সাবস্ক্রিপশন রিনিউ রিকোয়েস্ট পাঠানো হয়েছে। অ্যাডমিন
              অনুমোদন করার পর আপনি আবার লগইন করতে পারবেন। ধন্যবাদ!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <Button
              onClick={onBackToLogin}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              লগইনে ফিরে যান
            </Button>
          </div>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper>
      {/* Header */}
      <div className="relative overflow-hidden rounded-t-2xl bg-linear-to-br from-amber-500 via-orange-500 to-red-500 dark:from-amber-600 dark:via-orange-600 dark:to-red-600 p-6 text-white">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
            <ShieldAlert className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Subscription Expired
            </p>
            <h2 className="mt-0.5 text-lg font-bold leading-snug">
              আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়েছে
            </h2>
          </div>
        </div>

        <p className="relative mt-4 text-sm text-white/85 leading-relaxed">
          আপনার সাবস্ক্রিপশনের মেয়াদ উত্তীর্ণ হয়েছে। সিস্টেম ব্যবহার অব্যাহত
          রাখতে নিচের ফর্মটি পূরণ করে রিনিউ রিকোয়েস্ট পাঠান। অ্যাডমিন অনুমোদনের
          পর আপনার অ্যাকাউন্ট সক্রিয় হবে।
        </p>
      </div>

      {/* Body */}
      <ScrollArea className="max-h-[80vh] pr-3">
        <div className="p-5 sm:p-6 space-y-5 max-h-[calc(100vh-260px)] scrollbar-thin">
          {/* bKash info card */}
          <div className="rounded-xl border border-pink-100 dark:border-pink-900/30 bg-pink-50/70 dark:bg-pink-950/20 p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E2136E] text-white font-bold text-sm shadow-md shadow-pink-200 dark:shadow-pink-900/30">
                  <MessageCircle />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    পেমেন্ট করুন (Send Money)
                  </p>
                  <p className="text-lg font-bold text-foreground tracking-wider">
                    {COMPANY_BKASH_NUMBER}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={cn(
                  "gap-2 border-pink-200 dark:border-pink-800 transition-all",
                  copied &&
                    "border-emerald-400 text-emerald-600 dark:text-emerald-400",
                )}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    কপি হয়েছে!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    কপি করুন
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                পেমেন্ট পদ্ধতি <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11",
                        errors.paymentMethod &&
                          "border-red-500 focus:ring-red-500",
                      )}
                    >
                      <SelectValue placeholder="পেমেন্ট পদ্ধতি বেছে নিন" />
                    </SelectTrigger>
                    <SelectContent className="z-9999">
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          <span className="flex items-center gap-2">
                            <span>{m.emoji}</span>
                            <span>{m.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.paymentMethod && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            {/* Transaction ID */}
            <div className="space-y-2">
              <label
                htmlFor="transactionId"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                ট্রানজেকশন আইডি <span className="text-red-500">*</span>
              </label>
              <Input
                id="transactionId"
                {...register("transactionId")}
                placeholder="যেমন: ABC123XYZ456"
                className={cn(
                  "h-11 font-mono tracking-wider",
                  errors.transactionId && "border-red-500 focus:ring-red-500",
                )}
              />
              {errors.transactionId && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.transactionId.message}
                </p>
              )}
            </div>

            {/* Screenshot Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                পেমেন্ট স্ক্রিনশট <span className="text-red-500">*</span>
              </label>
              <div>
                {previewUrl ? (
                  <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-emerald-400 dark:border-emerald-600">
                    <Image
                      src={previewUrl}
                      alt="Payment screenshot"
                      width={400}
                      height={200}
                      className="w-full max-h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                      aria-label="Remove screenshot"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/40 py-1 px-3 text-[11px] text-white">
                      স্ক্রিনশট আপলোড হয়েছে ✓
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="screenshot-upload"
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer",
                      "h-32 transition-colors",
                      "border-muted-foreground/25 hover:border-primary/60 hover:bg-primary/5",
                      "dark:border-muted-foreground/20 dark:hover:border-primary/40",
                      errors.paymentScreenshot &&
                        "border-red-500 hover:border-red-500 hover:bg-red-500/5",
                    )}
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          ক্লিক করে স্ক্রিনশট আপলোড করুন
                        </span>
                        <span className="text-xs text-muted-foreground/60">
                          PNG, JPG, JPEG (সর্বোচ্চ ৫ MB)
                        </span>
                      </>
                    )}
                    <input
                      id="screenshot-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
              {errors.paymentScreenshot && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.paymentScreenshot.message}
                </p>
              )}
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label
                htmlFor="note"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                অতিরিক্ত নোট{" "}
                <span className="normal-case font-normal">(ঐচ্ছিক)</span>
              </label>
              <Textarea
                id="note"
                {...register("note")}
                placeholder="কোনো বিশেষ তথ্য থাকলে এখানে লিখুন..."
                className="resize-none h-20"
              />
              {errors.note && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.note.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 hover:cursor-pointer h-11 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md shadow-orange-200/50 dark:shadow-orange-900/20 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    পাঠানো হচ্ছে...
                  </>
                ) : (
                  "রিনিউ রিকোয়েস্ট পাঠান"
                )}
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={onBackToLogin}
              className="w-full text-muted-foreground text-xs"
            >
              লগইন পেজে ফিরে যান
            </Button>
          </form>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </ModalWrapper>
  );
}

function ModalWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Warning pulse ring */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-125 w-125 rounded-full bg-orange-500/5 animate-pulse" />
      </div>

      <div
        className={cn(
          "relative w-full max-w-lg rounded-2xl shadow-2xl",
          "bg-background border border-border/60",
          "dark:shadow-black/40",
          "animate-in fade-in-0 zoom-in-95 duration-300",
        )}
      >
        {children}
      </div>
    </div>
  );
}
