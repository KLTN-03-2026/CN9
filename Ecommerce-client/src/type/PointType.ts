interface PointBase {
  discount_value: number;
  discount_type: "fixed" | "percent";
}

export interface PointType extends PointBase {
  point: number;
  id: number;
}
