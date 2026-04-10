interface PointRuleBase {
  point: number;
  discount_type: "percent" | "fixed";
  discount_value: number;
}

export interface CreatePointRule extends PointRuleBase {}

export interface PointRuleType extends PointRuleBase {
  is_active: boolean;
  id: number;
}
