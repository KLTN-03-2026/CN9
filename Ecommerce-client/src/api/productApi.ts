import axios from "../utils/axiosConfig";

export type ProductSort = "best_seller" | "newest" | "price_desc" | "price_asc";

export const FeaturedProducts = async () => {
  const res = await axios.get("/products/featured");
  return res.data;
};

export const getAllProducts = async () => {
  const res = await axios.get("/products/");
  return res.data;
};

export const getProductBySlug = async (slug: string) => {
  const res = await axios.get("/products/slug/" + slug);
  return res.data;
};

export const getSaleProducts = async () => {
  const res = await axios.get("/products/sale");
  return res.data;
};

export const searchProduct = async (keyword: string) => {
  const res = await axios.get("/products/search?keyword=" + keyword);
  return res.data;
};

export const createProductView = async (productId: number) => {
  const res = await axios.post(`/products/${productId}/view`);
  return res.data;
};
