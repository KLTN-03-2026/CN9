import { PointType } from "./PointType";

interface UserBase {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: File | string;
}

export interface CreateUserType extends UserBase {}

export interface UserType extends UserBase {
  id: number;
  isActive: boolean;
  createdAt: string;
  countOrder: number;
}

export interface InfoUserType extends UserBase {
  id: number;
  isActive: boolean;
  createdAt: string;
  points: number;
  pointHistory: PointType[];
}

export interface UpdateUserType extends UserBase {
  point: number;
  type: "increase" | "decrease";
  description: string;
}
