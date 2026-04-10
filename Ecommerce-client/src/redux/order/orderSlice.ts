import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VoucherType } from "../../type/VoucherType";

export interface OrderItem {
  variantId: number;
  productId: number;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  sale?: {
    discount_type: "fixed" | "percent";
    discount_value: number;
  } | null;
}

export interface OrderState {
  items: OrderItem[];
  voucher: VoucherType | null;
  paymentMethod: { id: number; code: string };
  pointDiscount: {
    type: "fixed" | "percent";
    value: number;
  } | null;
  customer: {
    email: string;
    fullName: string;
    phone: string;
    shippingAddress: string;
  };
  note?: string;
  isSubmitting: boolean;
}

const initialState: OrderState = {
  items: [],
  voucher: null,
  pointDiscount: { type: "fixed", value: 0 },
  paymentMethod: { id: 0, code: "" },
  customer: { email: "", fullName: "", phone: "", shippingAddress: "" },
  isSubmitting: false,
  note: "",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderItem(state, action: PayloadAction<OrderItem[]>) {
      state.items = action.payload;
    },
    addOrderItem(state, action: PayloadAction<OrderItem>) {
      const existingItem = state.items.find(
        (item) => item.variantId === action.payload.variantId,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    setVoucherForOrder(state, action: PayloadAction<OrderState["voucher"]>) {
      state.voucher = action.payload;
    },
    setPoint(state, action: PayloadAction<OrderState["pointDiscount"]>) {
      state.pointDiscount = action.payload;
    },
    setInfo(state, action: PayloadAction<OrderState["customer"]>) {
      state.customer = action.payload;
    },
    setPayment(state, action: PayloadAction<OrderState["paymentMethod"]>) {
      state.paymentMethod = action.payload;
    },
    setSubmitting(state, action: PayloadAction<boolean>) {
      state.isSubmitting = action.payload;
    },
    clearOrder() {
      return initialState;
    },
  },
});

export const {
  setInfo,
  setPoint,
  clearOrder,
  setPayment,
  addOrderItem,
  setOrderItem,
  setSubmitting,
  setVoucherForOrder,
} = orderSlice.actions;
export default orderSlice.reducer;
