/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return null;

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET!
    ) as any;

    return {
      _id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      subscriptionAccess: decoded.subscriptionAccess,
      subscriptionExpireAt: decoded.subscriptionExpireAt,
    };
  } catch {
    return null;
  }
};