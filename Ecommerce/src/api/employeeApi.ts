import { CreateEmployee } from "../types/EmployeeType";
import axios from "../utils/axiosConfig";

export const createEmployee = async (data: CreateEmployee) => {
  const res = await axios.post("/admins", data);
  return res.data;
};

export const toggleAccountActive = async (
  id: number,
  data: { isActive: boolean },
) => {
  const res = await axios.patch(`/admins/${id}/active`, data);
  return res.data;
};

export const getAllEmployees = async (
  limit: number,
  page: number,
  search?: string,
) => {
  const res = await axios.get("/admins", {
    params: {
      limit,
      page,
      ...(search ? { search } : {}),
    },
  });

  return res.data;
};
