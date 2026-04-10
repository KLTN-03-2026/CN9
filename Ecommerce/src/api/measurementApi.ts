import {
  CreateMeasurementType,
  UpdateMeasurementType,
} from "../types/MeasurementType";

import axios from "../utils/axiosConfig";

export const createMeasurement = async (data: CreateMeasurementType) => {
  const res = await axios.post("/measurements/", data);
  return res.data;
};

export const getAllMeasurement = async () => {
  const res = await axios.get("/measurements/");
  return res.data;
};

export const getMeasurementById = async (id: number) => {
  const res = await axios.get("/measurements/" + id);
  return res.data;
};

export const updateMeasurementById = async (
  id: number,
  data: UpdateMeasurementType,
) => {
  const res = await axios.put("/measurements/" + id, data);
  return res.data;
};
