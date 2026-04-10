import type { CreateBankAccountType } from "../type/BankAccountType";
import axios from "../utils/axiosConfig";

export const createBankAccount = async (data: CreateBankAccountType) => {
  const res = await axios.post("/bank-accounts/", data);
  return res.data;
};

export const getAllUserBankAccount = async () => {
  const res = await axios.get("/bank-accounts/");
  return res.data;
};

export const togglePrimaryUserbankAccount = async (id: number) => {
  const res = await axios.patch(`/bank-accounts/${id}`);
  return res.data;
};
