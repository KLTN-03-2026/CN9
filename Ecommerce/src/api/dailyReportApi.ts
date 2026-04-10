import axios from "../utils/axiosConfig";

export const getDailyReportsByDay = async (date: number) => {
  const res = await axios.get("/daily-reports/day", {
    params: { date },
  });
  return res.data;
};

export const getDailyReportsByMonth = async (year: number, month: number) => {
  const res = await axios.get("/daily-reports/month", {
    params: { year, month },
  });
  return res.data;
};

export const getRevenueByYear = async (year: number) => {
  const res = await axios.get("/daily-reports/year", {
    params: { year },
  });
  return res.data;
};
