import axios from "../utils/axiosConfig";

export const getAllSizes = async () => {
  const res = await axios.get("/sizes/");
  return res.data;
};
