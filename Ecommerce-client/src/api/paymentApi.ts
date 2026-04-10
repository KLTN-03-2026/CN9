import axios from "../utils/axiosConfig";

export const createVNPayUrl = async (data: {
  orderId: number;
  amount: number;
}) => {
  const res = await axios.post("/payments/vnpay", data);
  return res.data;
};

export const createPayment = async (data: {
  orderId: number;
  amount: number;
}) => {
  const res = await axios.post("/payments/cod", data);
  return res.data;
};

export type PaymentStatus =
  | "pending"
  | "processing"
  | "success"
  | "failed"
  | "refunded"
  | "partially_refunded";
