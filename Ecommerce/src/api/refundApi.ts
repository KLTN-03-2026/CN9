import axios from "../utils/axiosConfig";

export const updateRefundByVNPAY = async (
  id: number,
  data: { reason: string; amount: number; adminId: number; paymentId: number },
) => {
  const res = await axios.put(`/refunds/${id}/VNPAY`, data);
  return res.data;
};

export const processManualRefund = async (id: number, formData: FormData) => {
  const res = await axios.put(`/refunds/${id}`, formData);
  return res.data;
};
