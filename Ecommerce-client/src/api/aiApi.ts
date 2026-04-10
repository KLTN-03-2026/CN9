import axios from "../utils/axiosConfig";

export const aiSearch = async (data: { message: string }) => {
  const res = await axios.post("/ai/search", data);
  return res.data;
};
