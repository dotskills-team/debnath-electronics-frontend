/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { CourierInfo } from "./CourierInfo";
import { User, Mail, Phone, MapPin, Clock, Zap, User2 } from "lucide-react";
import { format } from "date-fns";
import type { Order } from "@/types/orders";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGetCourierByOrderIdQuery } from "@/lib/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
}: OrderDetailsModalProps) {
  const { data: courierRes } = useGetCourierByOrderIdQuery(order?._id || "", {
    skip: !order?._id,
  });

  const courier = courierRes?.data;
  const totalAmount = order?.total || 0;
  const dueAmount = order?.paymentDetails?.dueAmount ?? 0;
  const paymentMethod =
    order?.paymentMethod ||
    order?.paymentDetails?.paymentMethod ||
    "Cash on Delivery";
  // console.log(courier);

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <ScrollArea className="max-h-[90vh] overflow-y-auto pr-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <Badge variant="outline" className="font-mono">
                {order.customOrderId || order._id?.slice(0, 10)}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Created on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status Section */}
            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-semibold">Status Information</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Order Status</p>
                  <div className="mt-1">
                    <OrderStatusBadge status={order.orderStatus} type="order" />
                  </div>
                </div>
                {order.confirmedBy && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Confirmed By
                    </p>

                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-700"
                      >
                        <User2 className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {order?.confirmedBy?.name}
                        </span>
                      </Badge>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">
                    Delivery Status
                  </p>
                  <div className="mt-1">
                    <OrderStatusBadge
                      status={order.deliveryStatus}
                      type="delivery"
                    />
                  </div>
                </div>
              </div>
              {order.scheduledAt && (
                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                      Scheduled Order
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {format(new Date(order.scheduledAt), "PPpp")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Scheduled processing date & time
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-semibold">Customer Information</p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {order.billingDetails?.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{order.billingDetails?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.billingDetails?.phone}</p>
                  </div>
                </div>
                {order?.billingDetails?.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Shipping Address
                      </p>
                      <p className="font-medium">
                        {order.billingDetails?.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm font-semibold">Order Items</p>
              <div className="space-y-2">
                {order?.products.map((product: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between border-t pt-2 first:border-t-0 first:pt-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.product?.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {product.quantity} × ৳{product?.price?.toFixed(2)}
                      </p>
                    </div>
                    {product?.product?.warrantyEnabled && (
                      <div className="flex-1">
                        <p className="font-medium">{product?.product?.warrantyType}</p>
                        <p className="text-xs text-muted-foreground">
                          {product?.product?.warrantyDay}
                        </p>
                      </div>
                    )}
                    <p className="font-medium">
                      ৳{(product.quantity * product.price)?.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-amber-200">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Financial Summary</h3>

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>৳{order?.subTotal || totalAmount}</span>
                  </div>

                  {(order.discount ?? 0) > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Discount</span>
                      <span>-৳{order.discount}</span>
                    </div>
                  )}

                  {(order.shippingCost ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>৳{order.shippingCost}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <Badge variant="outline">{paymentMethod}</Badge>
                  </div>

                  <div className="flex justify-between">
                    <span>Paid Amount</span>
                    <span className="font-semibold text-green-600">
                      ৳{order?.paymentDetails?.paidAmount}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Due Amount</span>
                    <span
                      className={
                        dueAmount > 0
                          ? "font-semibold text-red-600"
                          : "font-semibold text-green-600"
                      }
                    >
                      ৳{dueAmount}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-semibold">Grand Total</span>

                    <span className="font-bold text-xl">
                      ৳{totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <Badge
                    className={
                      dueAmount > 0
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }
                  >
                    {dueAmount > 0 ? "Partially Paid" : "Fully Paid"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {courier && <CourierInfo courier={courier} />}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
