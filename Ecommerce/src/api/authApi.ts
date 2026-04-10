import axios from "../utils/axiosConfig";

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await axios.post("/auths/login", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post("/auths/logout");
  return res.data;
};

export const getInfoAccount = async () => {
  const res = await axios.get("/auths/me/");
  return res.data;
};
