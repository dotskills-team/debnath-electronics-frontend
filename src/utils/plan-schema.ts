import { z } from "zod";
import { Role, PlanStatus } from "../types";

export const createPlanSchema = z.object({
  name: z.string().min(2, "Plan name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  durationInDays: z.coerce.number().min(1, "Duration must be at least 1 day"),
  description: z.string().optional(),
  maxUsers: z.coerce.number().min(1).optional(),
  features: z.array(z.string()).optional(),
  status: z.nativeEnum(PlanStatus).optional(),
});

export const updatePlanSchema = createPlanSchema.partial().extend({
  name: z.string().min(2).optional(),
});

export type CreatePlanFormValues = z.infer<typeof createPlanSchema>;
export type UpdatePlanFormValues = z.infer<typeof updatePlanSchema>;

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  address: z.string().min(3, "Address is required"),
  role: z.nativeEnum(Role),
  planId: z.string().optional(),
  durationInDays: z.coerce.number().min(1).optional(),
  customPrice: z.coerce.number().min(0).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().min(3).optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;


export const assignPlanSchema = z.object({
  planId: z.string().min(1, "Please select a plan"),
  durationInDays: z.coerce.number().min(1, "Duration must be at least 1 day").optional(),
  customPrice: z.coerce.number().min(0).optional(),
});

export type AssignPlanFormValues = z.infer<typeof assignPlanSchema>;

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;