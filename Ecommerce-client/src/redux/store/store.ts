import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../auth/authSlice";
import cartReducer from "../cart/cartSlice";
import orderReducer from "../order/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
