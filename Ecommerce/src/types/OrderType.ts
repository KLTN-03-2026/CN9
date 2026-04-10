import { ReturnType } from "./ReturnType";
import { VoucherType } from "./VoucherType";

interface Orderbase {
  name: string;
  createdAt: string;
  totalPrice: string;
}

export interface OrderType extends Orderbase {
  id: number;
  status: { code: string; name: string; hex: string };
}

export interface OrderItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageVariant: string;
  color: string;
  size: string;
  productId: number;
  returns: ReturnType;
}

export interface OrderDetailType extends Orderbase {
  id: number;
  totalPrice: string;
  address: string;
  email: string;
  phone: string;
  items: OrderItemType[];
  createdAt: string;
  status: {
    id: number;
    name: string;
    hex: string;
    code: string;
    isFinal: boolean;
    isCancelable: boolean;
  };
  isComment: boolean;
  payment: {
    id: number;
    status: PaymentStatus;
    method: { id: number; code: string };
  };
  voucher: VoucherType;
  pointDiscount: string;
}

export type PaymentStatus =
  | "pending"
  | "processing"
  | "success"
  | "failed"
  | "refunded"
  | "partially_refunded";
