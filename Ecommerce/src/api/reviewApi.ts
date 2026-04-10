import axios from "../utils/axiosConfig";

export const getAllReviews = async () => {
  const res = await axios.get("/reviews/");
  return res.data;
};

export const getPendingReviews = async () => {
  const res = await axios.get("/reviews/pending");
  return res.data;
};

export const getReviewById = async (id: number) => {
  const res = await axios.get("/reviews/" + id);
  return res.data;
};

export const moderateReview = async (
  id: number,
  data: { adminId: number; status: "APPROVED" | "REJECTED" },
) => {
  const res = await axios.patch(`/reviews/${id}/moderate`, data);
  return res.data;
};

export const replyToReview = async (
  id: number,
  data: { adminId: number; content: string },
) => {
  const res = await axios.patch(`/reviews/${id}/reply`, data);
  return res.data;
};
