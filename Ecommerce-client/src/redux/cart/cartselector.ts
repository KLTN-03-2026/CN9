import type { RootState } from "../store/store";

export const selectTotalPrice = (state: RootState) => {
  const checkedItems = state.cart.items.filter((item) => item.isChecked);

  // 🔹 1. Tổng sau khi áp SALE từng sản phẩm
  const totalAfterSale = checkedItems.reduce((total, item) => {
    let discount = 0;

    if (item.sale) {
      if (item.sale.discount_type === "percent") {
        discount = (item.price * item.sale.discount_value) / 100;
      } else {
        discount = item.sale.discount_value;
      }
    }

    const finalPrice = item.price - discount;

    return total + finalPrice * item.quantity;
  }, 0);

  // 🔹 2. Áp VOUCHER trên tổng sau sale
  let voucherDiscount = 0;

  if (state.cart.voucher) {
    if (state.cart.voucher.discount_type === "percent") {
      voucherDiscount =
        (totalAfterSale * state.cart.voucher.discount_value) / 100;
    } else {
      voucherDiscount = state.cart.voucher.discount_value;
    }
  }

  // 🔹 3. Tổng cuối cùng
  const finalTotal = totalAfterSale - voucherDiscount;

  return finalTotal > 0 ? finalTotal : 0;
};

export const selectTotalDiscount = (state: RootState) => {
  const checkedItems = state.cart.items.filter((item) => item.isChecked);

  // 🔹 1. Discount từ SALE sản phẩm
  const saleDiscount = checkedItems.reduce((total, item) => {
    if (!item.sale) return total;

    let discount = 0;

    if (item.sale.discount_type === "percent") {
      discount = (item.price * item.sale.discount_value) / 100;
    } else {
      discount = item.sale.discount_value;
    }

    return total + discount * item.quantity;
  }, 0);

  // 🔹 2. Tổng sau sale
  const totalAfterSale = checkedItems.reduce((total, item) => {
    let discount = 0;

    if (item.sale) {
      if (item.sale.discount_type === "percent") {
        discount = (item.price * item.sale.discount_value) / 100;
      } else {
        discount = item.sale.discount_value;
      }
    }

    const finalPrice = item.price - discount;

    return total + finalPrice * item.quantity;
  }, 0);

  // 🔹 3. Discount từ VOUCHER
  let voucherDiscount = 0;

  if (state.order.voucher) {
    if (state.order.voucher.discount_type === "percent") {
      voucherDiscount =
        (totalAfterSale * state.order.voucher.discount_value) / 100;
    } else {
      voucherDiscount = state.order.voucher.discount_value;
    }
  }

  let pointDiscount = 0;

  if (state.order.pointDiscount) {
    if (state.order.pointDiscount.type === "percent") {
      pointDiscount = (totalAfterSale * state.order.pointDiscount.value) / 100;
    } else {
      pointDiscount = state.order.pointDiscount.value;
    }
  }

  return saleDiscount + voucherDiscount + pointDiscount;
};

export const selectOriginalTotal = (state: RootState) => {
  return state.cart.items
    .filter((item) => item.isChecked)
    .reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
};
