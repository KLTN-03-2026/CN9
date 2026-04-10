import axios from "../utils/axiosConfig";

export const confirmCodPaymentReceived = async (
  id: number,
  adminId: number,
) => {
  const res = await axios.patch(`/payments/${id}/cod-confirm/${adminId}`);
  return res.data;
};

export const getRevenue = async (params?: {
  day?: number;
  month?: number;
  year?: number;
}) => {
  const res = await axios.get("/payments/revenue", {
    params,
  });
  return res.data;
};
