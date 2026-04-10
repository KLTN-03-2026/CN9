export type StatusMessageType = "success" | "error" | "warning";

interface StatusBasae {
  name: string;
  hex: string;
  description: string;
}

export interface CreateProductStatus extends StatusBasae {}

export interface CreateOrderStatus extends StatusBasae {
  sequence: number;
  is_final: boolean;
  is_cancelable: boolean;
  code: string;
}

export interface StatusType extends StatusBasae {
  countNumber: number;
}
