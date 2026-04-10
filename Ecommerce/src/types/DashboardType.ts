import { JSX } from "react";

export type DashboardItemType = "number" | "currency";
export type TrendType = "up" | "down" | "natural";

export interface DashboardItem {
  title: string;
  value: number;
  growth: number;
  icon: JSX.Element;
  trend: TrendType;
  type: DashboardItemType;
}

export interface DashboardData {
  revenue: DashboardItem;
  orders: DashboardItem;
  users: DashboardItem;
}
