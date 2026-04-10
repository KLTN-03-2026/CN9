import { CreateGender, UpdateGender } from "../types/GenderType";
import axios from "../utils/axiosConfig";

export const createGender = async (data: CreateGender) => {
  const res = await axios.post("/genders", data);
  return res.data;
};

export const getAllGenders = async () => {
  const res = await axios.get("/genders");
  return res.data;
};

export const updateGenderById = async (id: number, data: UpdateGender) => {
  const res = await axios.put("/genders/" + id, data);
  return res.data;
};
