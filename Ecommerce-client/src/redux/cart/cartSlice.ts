import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type VoucherType } from "../../type/VoucherType";

export interface CartItem {
  variantId: number;
  productId: number;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  isChecked: boolean;
  sale?: {
    discount_type: "fixed" | "percent";
    discount_value: number;
  } | null;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  voucher?: VoucherType | null;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  voucher: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartState>) {
      return action.payload;
    },

    addItem(state, action: PayloadAction<CartItem>) {
      const item = state.items.find(
        (i) => i.variantId === action.payload.variantId,
      );

      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.totalQuantity += action.payload.quantity;
    },

    removeItem(state, action: PayloadAction<number>) {
      const index = state.items.findIndex(
        (i) => i.variantId === action.payload,
      );

      if (index !== -1) {
        const removedItem = state.items[index];

        state.totalQuantity -= removedItem.quantity;

        state.items.splice(index, 1);
      }
    },
    removeItems(state, action: PayloadAction<number[]>) {
      const idsToRemove = action.payload;

      const removedItems = state.items.filter((item) =>
        idsToRemove.includes(item.variantId),
      );

      const removedQuantity = removedItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      state.totalQuantity -= removedQuantity;

      state.items = state.items.filter(
        (item) => !idsToRemove.includes(item.variantId),
      );
    },
    increaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.variantId === action.payload);

      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
      }
    },
    decreaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.variantId === action.payload);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalQuantity -= 1;
      }
    },
    toggleItem(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.variantId === action.payload);

      if (item) {
        item.isChecked = !item.isChecked;
      }
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.items.forEach((item) => {
        item.isChecked = action.payload;
      });
    },
    setVoucher(state, action: PayloadAction<CartState["voucher"]>) {
      state.voucher = action.payload;
    },
  },
});

export const {
  setCart,
  addItem,
  toggleAll,
  setVoucher,
  toggleItem,
  removeItem,
  removeItems,
  decreaseQuantity,
  increaseQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
