import { CreateSize } from "../types/SizeType";
import axios from "../utils/axiosConfig";

export const createSize = async (data: CreateSize) => {
  const res = await axios.post("/sizes/", data);
  return res.data;
};

export const getAllSizes = async () => {
  const res = await axios.get("/sizes/");
  return res.data;
};

export const createSizeGuide = async (data: {
  categoryId: number;
  sizeId: number;
  measurementId: number;
  min: number;
  max: number;
}) => {
  const res = await axios.post("/size-guides/", data);
  return res.data;
};

export const getSizeGuideByCategory = async (categoryId: number) => {
  const res = await axios.get("/size-guides/category/" + categoryId);
  return res.data;
};

export const getSizeGuideByIdSizeMeasurement = async (
  sizeMeasurementId: number,
) => {
  const res = await axios.get("/size-guides/" + sizeMeasurementId);
  return res.data;
};

export const updateSizeGuideById = async (
  sizeGuideId: number,
  sizeMeasurementId: number,
) => {
  const res = await axios.get(
    `/size-guides/${sizeGuideId}/measurement/${sizeMeasurementId}`,
  );
  return res.data;
};
