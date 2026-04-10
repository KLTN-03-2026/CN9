interface PointBase {
  points: number;
  type: "increase" | "decrease";
  description: string;
}

export interface PointType extends PointBase {
  id: number;
  createdAt: string;
}
