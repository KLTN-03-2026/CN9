import { CreateSale, UpdateSale } from "../types/SaleType";
import axios from "../utils/axiosConfig";

export const createSale = async (data: CreateSale) => {
  const res = await axios.post("/sales/", data);
  return res.data;
};

export const getSaleById = async (id: number) => {
  const res = await axios.get("/sales/" + id);
  return res.data;
};

export const updateSaleById = async (id: number, data: UpdateSale) => {
  const res = await axios.put("/sales/" + id, data);
  return res.data;
};

export const getAllSales = async (search?: string) => {
  const res = await axios.get("/sales/", {
    params: {
      search: search || undefined,
    },
  });
  return res.data;
};

export const toggleSaleActive = async (
  id: number,
  data: { isActive: boolean },
) => {
  const res = await axios.patch(`/sales/${id}/active`, data);
  return res.data;
};
