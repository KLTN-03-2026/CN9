import { CreateColor } from "../types/ColorType";
import axios from "../utils/axiosConfig";

export const createColor = async (data: CreateColor) => {
  const res = await axios.post("/colors/", data);
  return res.data;
};

export const getAllColors = async () => {
  const res = await axios.get("/colors/");
  return res.data;
};
