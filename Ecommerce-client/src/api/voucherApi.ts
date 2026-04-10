import axios from "../utils/axiosConfig";

export const getVoucherByCode = async (code: string, total: number) => {
  const res = await axios.get(`/vouchers/${code}/?total=${total}`);
  return res.data;
};
