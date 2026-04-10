import type { RootState } from "../store/store";

export const selectOriginalTotal = (state: RootState) => {
  return state.order.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

export const selectSaleDiscount = (state: RootState) => {
  return state.order.items.reduce((total, item) => {
    if (!item.sale) return total;

    let discount = 0;

    if (item.sale.discount_type === "percent") {
      discount = (item.price * item.sale.discount_value) / 100;
    } else {
      discount = item.sale.discount_value;
    }

    return total + discount * item.quantity;
  }, 0);
};

export const selectSubTotalAfterSale = (state: RootState) => {
  const original = selectOriginalTotal(state);
  const saleDiscount = selectSaleDiscount(state);

  return original - saleDiscount;
};

export const selectVoucherDiscount = (state: RootState) => {
  const subtotal = selectSubTotalAfterSale(state);
  const voucher = state.order.voucher;

  if (!voucher) return 0;

  const discount =
    voucher.discount_type === "percent"
      ? (subtotal * voucher.discount_value) / 100
      : voucher.discount_value;

  return Math.min(discount, subtotal);
};

export const selectPointDiscount = (state: RootState) => {
  const subtotalAfterSale = selectSubTotalAfterSale(state);

  const voucherDiscount = selectVoucherDiscount(state);

  const point = state.order.pointDiscount;


  if (!point) return 0;

  const base = subtotalAfterSale - voucherDiscount;

  const discount =
    point.type === "percent" ? (base * point.value) / 100 : point.value;

  return Math.min(discount, base);
};

export const selectTotalDiscount = (state: RootState) => {
  return (
    selectSaleDiscount(state) +
    selectVoucherDiscount(state) +
    selectPointDiscount(state)
  );
};

export const selectFinalTotal = (state: RootState) => {
  const original = selectOriginalTotal(state);

  const totalDiscount = selectTotalDiscount(state);

  const final = original - totalDiscount;

  return final > 0 ? final : 0;
};
