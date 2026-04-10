interface SaleBase {
  name: string;
  description: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  start_date: string;
  end_date: string;
}

export interface CreateSale extends SaleBase {}

export interface UpdateSale extends Partial<SaleBase> {}

export interface SaleType extends SaleBase {
  id: number;
  isActive: boolean;
}
