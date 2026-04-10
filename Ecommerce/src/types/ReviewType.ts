export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

interface ReviewBase {
  status: ReviewStatus;
  content: string;
  rating: number;
  product: { name: string; imageProduct: string };
  user: { name: string; avatar: string };
}

export interface ReviewType extends ReviewBase {
  id: number;
}

export interface ReviewDetailType extends ReviewBase {
  id: number;
  createdAt: string;
  images: string[];
  shopReply: string;
}
