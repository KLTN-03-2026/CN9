import type { ReviewType } from "./ReviewType";
import type { VoucherType } from "./VoucherType";

interface Orderbase {
  email: string;
  name: string;
  phone: string;
  note?: string;
  address: string;
  usedPoints?: number;
  earnedPoints?: number;
  shippingFee: number;
  paymentMethod: number;
}

export interface CreateOrder extends Orderbase {
  totalPrice: number;
  voucherId?: number;
  item: { variantId: number; price: number; quantity: number }[];
  pointDiscount: number;
}

export interface OrderItemType {
  id: number;
  name: string;
  price: string;
  quantity: number;
  imageVariant: string;
  review: ReviewType;
  color: string;
  size: string;
  productId: number;
}

export interface OrderType extends Orderbase {
  id: number;
  totalPrice: string;
  items: OrderItemType[];
  createdAt: string;
  status: { id: number; name: string; hex: string; code: string };
  isComment: boolean;
  payment: {
    id: number;
    status: "pending" | "processing" | "success" | "failed" | "refunded";
    method: { id: number; code: string };
  };
  voucher: VoucherType;
  pointDiscount: string;
}

export type OrderStatusCode =
  | ""
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export interface OrderStatusType {
  id: number;
  name: string;
  code: OrderStatusCode;
}
