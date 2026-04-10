import axios from "../utils/axiosConfig";

export const getAllOrders = async () => {
  const res = await axios.get("/orders");
  return res.data;
};

export const getLatestPendingOrders = async () => {
  const res = await axios.get("/orders/latest-pending");
  return res.data;
};

export const getOrderById = async (id: number) => {
  const res = await axios.get("/orders/" + id);
  return res.data;
};

export const updateOrderStatusById = async (id: number) => {
  const res = await axios.patch("/orders/" + id);
  return res.data;
};

export const getTotalOrders = async (params?: {
  day?: number;
  month?: number;
  year?: number;
}) => {
  const res = await axios.get("/orders/count", {
    params,
  });
  return res.data;
};

export const getTotalSoldProducts = async (params?: {
  day?: number;
  month?: number;
  year?: number;
}) => {
  const res = await axios.get("/orders/sold-products", {
    params,
  });
  return res.data;
};
