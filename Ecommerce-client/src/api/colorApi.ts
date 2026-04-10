import axios from "../utils/axiosConfig";

export const getAllColors = async () => {
  const res = await axios.get("/colors/");
  return res.data;
};
