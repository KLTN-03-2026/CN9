interface VoucherBase {
  discount_type: "fixed" | "percent";
  discount_value: number;
}

export interface VoucherType extends VoucherBase {
  id: number;
}
