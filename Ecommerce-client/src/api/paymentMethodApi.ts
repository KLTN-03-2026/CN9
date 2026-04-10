import axios from "../utils/axiosConfig";

export const getAllPaymentMethodsActive = async () => {
  const res = await axios.get("/payment-methods/active");
  return res.data;
};
