import axios from "../utils/axiosConfig";

export const createReview = async (data: FormData) => {
  const res = await axios.post("/reviews/", data);
  return res.data;
};
