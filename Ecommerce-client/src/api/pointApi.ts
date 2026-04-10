import axios from "../utils/axiosConfig";

export const getAllPointRules = async () => {
  const res = await axios.get("/point-rules");
  return res.data;
};
