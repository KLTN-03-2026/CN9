import type { CreateUser } from "../type/UserType";
import axios from "../utils/axiosConfig";

export const createUser = async (data: CreateUser) => {
  const res = await axios.post("/users/", data);
  return res.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await axios.post("/auths/login", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post("/auths/logout");
  return res.data;
};

export const getInfoAccount = async () => {
  const res = await axios.get("/auths/me");
  return res.data;
};

export const getInfoUser = async () => {
  const res = await axios.get("/users/");
  return res.data;
};
