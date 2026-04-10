import axios from "../utils/axiosConfig";

export const getAllGenders = async () => {
  const res = await axios.get("/genders");
  return res.data;
};

export const getCategoriesBySlugGender = async (slug: string) => {
  const res = await axios.get("/genders/" + slug + "/categories");
  return res.data;
};
