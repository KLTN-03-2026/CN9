interface VoucherBase {
  code: string;
  description: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_value: number;
  start_date: string;
  end_date: string;
  usage_limit: number;
}

export interface CreateVoucher extends VoucherBase {}

export interface UpdateVoucher extends Partial<VoucherBase> {}

export interface VoucherType extends VoucherBase {
  id: number;
  usedCount: number;
  isActive: boolean;
}
