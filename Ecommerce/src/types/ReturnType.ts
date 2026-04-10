interface Returnbase {
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  imageReturn: string[];
}

export interface ReturnType extends Returnbase {
  id: number;
  adminNote: true;
  refundId: number;
}
