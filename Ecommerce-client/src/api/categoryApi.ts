import axios from "../utils/axiosConfig";

export const getAllCategory = async () => {
  const res = await axios.get("/categories");
  return res.data;
};

export const getCategoryById = async (id: number) => {
  const res = await axios.get("/categories/" + id);
  return res.data;
};

export const getProductBySlugCategory = async (slug: string) => {
  const res = await axios.get("/categories/" + slug + "/products");
  return res.data;
};
