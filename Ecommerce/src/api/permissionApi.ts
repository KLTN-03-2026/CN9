import { CreatePermissionGroup } from "../types/PermissionGroupType";
import { CreatePermission } from "../types/PermissionType";
import axios from "../utils/axiosConfig";

export const createPermissionGroup = async (data: CreatePermissionGroup) => {
  const res = await axios.post("/permission-groups", data);
  return res.data;
};

export const getAllPermissionGroup = async () => {
  const res = await axios.get("/permission-groups");
  return res.data;
};

export const getPermissionGroupById = async (id: number) => {
  const res = await axios.get(`/permission-groups/${id}`);
  return res.data;
};

export const updatePermissionGroupById = async (
  id: number,
  data: Partial<CreatePermissionGroup>,
) => {
  const res = await axios.put(`/permission-groups/${id}`, data);
  return res.data;
};

export const createPermission = async (data: CreatePermission) => {
  const res = await axios.post("/permissions", data);
  return res.data;
};

export const getAllPermission = async (search?: string) => {
  const res = await axios.get("/permissions", {
    params: {
      search: search || undefined,
    },
  });
  return res.data;
};

export const getPermissionById = async (id: number) => {
  const res = await axios.get("/permissions/" + id);
  return res.data;
};
