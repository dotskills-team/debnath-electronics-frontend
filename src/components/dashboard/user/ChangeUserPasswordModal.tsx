/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  KeyRound,
  User,
  Mail,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useChangePasswordMutation } from "@/redux/features/auth/auth.api";
import { IUser } from "@/types";

interface ChangeMyPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | undefined;
}

export default function ChangeUserPasswordModal({
  user,
  open,
  onOpenChange,
}: ChangeMyPasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const resetForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowOld(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!oldPassword.trim()) {
      return toast.error("Current password is required");
    }

    if (!newPassword.trim()) {
      return toast.error("New password is required");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (newPassword === oldPassword) {
      return toast.error(
        "New password must be different from current password",
      );
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await changePassword({
        oldPassword,
        newPassword,
      }).unwrap();

      toast.success("Password updated successfully");

      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-500" />
            Change Password
          </DialogTitle>

          <DialogDescription>
            Enter your current password before setting a new one.
          </DialogDescription>
        </DialogHeader>

        {/* USER INFO */}
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 space-y-1 text-sm">
          <p className="flex items-center gap-2">
            <User size={14} /> {user?.name}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Mail size={14} /> {user?.email}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Shield size={14} /> {user?.role}
          </p>
        </div>

        <div className="space-y-5">
          {/* Current Password */}

          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>

            <div className="relative">
              <Input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
              />

              <button
                type="button"
                onClick={() => setShowOld((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showOld ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* New Password */}

          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>

            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />

              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>

            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />

              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3 flex gap-2 text-sm text-muted-foreground">
            <LockKeyhole className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
            For security reasons, you&apos;ll need your current password before
            setting a new one.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#c9a84c] hover:bg-[#d4b86a] active:bg-[#b8973e]
                 text-sm font-bold tracking-[0.15em] text-white hover:cursor-pointer"
            >
              <KeyRound className="mr-2 h-4 w-4" />

              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
