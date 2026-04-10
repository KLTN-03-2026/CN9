import axios from "../utils/axiosConfig";

export const createProduct = async (formData: FormData) => {
  const res = await axios.post("/products/", formData);
  return res.data;
};

export const getAllProducts = async (search?: string) => {
  const res = await axios.get("/products/", {
    params: {
      search: search || undefined,
    },
  });
  return res.data;
};

export const getProductById = async (id: number) => {
  const res = await axios.get("/products/" + id);
  return res.data;
};

export const updateProductById = async (id: number, formData: FormData) => {
  const res = await axios.put("/products/" + id, formData);
  return res.data;
};

//variant
export const createProductVariant = async (id: number, formData: FormData) => {
  const res = await axios.post(`/products/${id}/variants`, formData);
  return res.data;
};

export const getAllProductVariants = async (id: number) => {
  const res = await axios.get(`/products/${id}/variants`);
  return res.data;
};
