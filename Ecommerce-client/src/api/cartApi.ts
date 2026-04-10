import axios from "../utils/axiosConfig";

export const addProductToCart = async (variantId: number, quantity: number) => {
  const res = await axios.post(
    `/carts/items/${variantId}/?quantity=${quantity}`,
  );
  return res.data;
};

export const removeProductToCart = async (variantId: number) => {
  const res = await axios.delete("/carts/items/" + variantId);
  return res.data;
};

export const increaseQuantityForCart = async (variantId: number) => {
  const res = await axios.patch(`/carts/items/${variantId}/increase`);
  return res.data;
};

export const decreaseQuantityForCart = async (variantId: number) => {
  const res = await axios.patch(`/carts/items/${variantId}/decrease`);
  return res.data;
};

export const getProductsToCart = async () => {
  const res = await axios.get("/carts");
  return res.data;
};
