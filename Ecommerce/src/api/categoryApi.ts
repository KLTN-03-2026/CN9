import axios from "../utils/axiosConfig";

export const createCategory = async (formData: FormData) => {
  const res = await axios.post("/categories", formData);
  return res.data;
};

export const getAllCategory = async (search?: string) => {
  const res = await axios.get("/categories", {
    params: {
      search: search || undefined,
    },
  });
  return res.data;
};

export const getCategoryById = async (id: number) => {
  const res = await axios.get("/categories/" + id);
  return res.data;
};

export const updateCategoryById = async (id: number, formData: FormData) => {
  const res = await axios.put("/categories/" + id, formData);
  return res.data;
};

export const getTopSellingCategories = async () => {
  const res = await axios.get("/categories/top-selling");
  return res.data;
};
