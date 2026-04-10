import axios from "../utils/axiosConfig";

export const approveReturnByAdminId = async (
  id: number,
  data: { status: "APPROVED" | "REJECTED"; adminNote: string },
) => {
  const res = await axios.put("/returns/" + id, data);
  return res.data;
};
