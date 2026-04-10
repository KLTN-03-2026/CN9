import { CreateVoucher, UpdateVoucher } from "../types/VoucherType";
import axios from "../utils/axiosConfig";

export const createVoucher = async (data: CreateVoucher) => {
  const res = await axios.post("/vouchers/", data);
  return res.data;
};

export const getVoucherById = async (id: number) => {
  const res = await axios.get("/vouchers/" + id);
  return res.data;
};

export const updateVoucherById = async (id: number, data: UpdateVoucher) => {
  const res = await axios.put("/vouchers/" + id, data);
  return res.data;
};

export const getAllVouchers = async (search?: string) => {
  const res = await axios.get("/vouchers/", {
    params: {
      search: search || undefined,
    },
  });
  return res.data;
};

export const toggleVoucherActive = async (
  id: number,
  data: { isActive: boolean },
) => {
  const res = await axios.patch(`/vouchers/${id}/active`, data);
  return res.data;
};
