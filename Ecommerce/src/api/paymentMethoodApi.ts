import { CreatePaymentMethood } from "../types/PaymentMethoodType";
import axios from "../utils/axiosConfig";

export const createPaymentMethood = async (data: CreatePaymentMethood) => {
  const res = await axios.post("/payment-methods/", data);
  return res.data;
};

export const getAllPaymentMethoods = async () => {
  const res = await axios.get("/payment-methods/");
  return res.data;
};

export const toggleActivePaymentMethood = async (id: number) => {
  const res = await axios.patch(`/payment-methods/${id}/toggle`);
  return res.data;
};
