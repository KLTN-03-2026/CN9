import { CreateOrderStatus, CreateProductStatus } from "../types/StatusType";
import axios from "../utils/axiosConfig";

export const createOrderStatus = async (data: CreateOrderStatus) => {
  const res = await axios.post("/order-statuses/", data);
  return res.data;
};

export const getAllOrderStatus = async () => {
  const res = await axios.get("/order-statuses/");
  return res.data;
};

export const createProductStatus = async (data: CreateProductStatus) => {
  const res = await axios.post("/product-statuses/", data);
  return res.data;
};

export const getAllProductStatus = async () => {
  const res = await axios.get("/product-statuses/");
  return res.data;
};
