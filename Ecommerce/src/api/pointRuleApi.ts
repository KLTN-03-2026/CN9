import { CreatePointRule } from "../types/PointRuleType";
import axios from "../utils/axiosConfig";

export const createPointRule = async (data: CreatePointRule) => {
  const res = await axios.post("/point-rules/", data);
  return res.data;
};

export const getAllPointRules = async () => {
  const res = await axios.get("/point-rules/");
  return res.data;
};

export const toggleActivePointRule = async (id: number) => {
  const res = await axios.patch(`/point-rules/${id}/toggle`);
  return res.data;
};
