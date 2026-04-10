import { togglePermissionGroupToRole } from "../types/RolePermissionGroup";
import { createRole } from "../types/RoleType";
import axios from "../utils/axiosConfig";

export const assignPermissionGroupToRole = async (
  data: togglePermissionGroupToRole
) => {
  const res = await axios.post("/role-permission-groups", data);
  return res.data;
};

export const getStatusPermissionGroupByRoleId = async (roleId: number) => {
  const res = await axios.get("/role-permission-groups/role/" + roleId);
  return res.data;
};

export const addRole = async (data: createRole) => {
  const res = await axios.post("/roles", data);
  return res.data;
};

export const getAllRole = async () => {
  const res = await axios.get("/roles");
  return res.data;
};

export const getRoleById = async (id: number) => {
  const res = await axios.get("/roles/" + id);
  return res.data;
};

export const deleteRoleById = async (id: number) => {
  const res = await axios.delete("/roles/" + id);
  return res.data;
};

export const updateRoleById = async (id: number, data: createRole) => {
  const res = await axios.put("/roles/" + id, data);
  return res.data;
};
