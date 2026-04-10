import type { CreateOrder } from "../type/OrderType";
import axios from "../utils/axiosConfig";

export const createOrder = async (data: CreateOrder) => {
  const res = await axios.post("/orders/", data);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await axios.get("/orders/my-orders");
  return res.data;
};

export const getOrderById = async (id: number) => {
  const res = await axios.get("/orders/" + id);
  return res.data;
};

export const cancelOrderByUserId = async (
  id: number,
  data: { reason: string },
) => {
  const res = await axios.patch(`/orders/${id}/cancel`, data);
  return res.data;
};

export const returnOrderByUserId = async (
  orderItemId: number,
  formData: FormData,
) => {
  const res = await axios.patch(`/orders/${orderItemId}/return`, formData);
  return res.data;
};

export const confirmOrderReceived = async (orderId: number) => {
  const res = await axios.patch(`/orders/${orderId}/confirm-received`);
  return res.data;
};

export const getAllOrderStatuses = async () => {
  const res = await axios.get("/order-statuses/");
  return res.data;
};
