import axios from "../utils/axiosConfig";

export const createUser = async (formData: FormData) => {
  const res = await axios.post("/admins/users/", formData);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axios.get("/admins/users/");
  return res.data;
};

export const getUserById = async (id: number) => {
  const res = await axios.get("/admins/users/" + id);
  return res.data;
};

export const updateUserById = async (id: number, formData: FormData) => {
  const res = await axios.put("/admins/users/" + id, formData);
  return res.data;
};

export const searchUser = async (keyword: string) => {
  const res = await axios.get("/admins/users/search?nameUser=" + keyword);
  return res.data;
};

export const getTotalUsers = async (params?: {
  day?: number;
  month?: number;
  year?: number;
}) => {
  const res = await axios.get(`/admins/users/count`, {
    params,
  });
  return res.data;
};

export const toggleUserActive = async (
  id: number,
  data: { isActive: boolean },
) => {
  const res = await axios.patch(`/admins/users/${id}/active`, data);
  return res.data;
};
