import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";

import { useEffect, useState } from "react";

import { getRevenueByYear } from "../../api/dailyReportApi";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler);

interface RevenueTrendProps {
  selectedDate: Date;
}

function RevenueTrend({ selectedDate }: RevenueTrendProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { display: false },
      x: {
        ticks: { autoSkip: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (item: any) => item.raw.toLocaleString("vi-VN") + "đ",
        },
      },
    },
  };

  const [chartData, setChartData] = useState({
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        label: "Doanh thu",
        data: Array(12).fill(0),
        fill: true,
        borderColor: "rgb(0, 255, 0)",
        backgroundColor: (context: any) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(0,255,0,0.2)");
          gradient.addColorStop(1, "rgba(0,255,0,0)");
          return gradient;
        },
        tension: 0.5,
        borderWidth: 3,
        pointRadius: 0,
      },
    ],
  });

  const [yearlyTotal, setYearlyTotal] = useState(0);

  const handleGetRevenueTrend = async (date: Date = selectedDate) => {
    try {
      const year = date.getFullYear();
      const resDailyByyear = await getRevenueByYear(year);

      const monthlyRevenue = Array(12).fill(0);

      const yearData: { month: number; revenue: number }[] =
        resDailyByyear?.data ?? [];

      yearData.forEach(({ month, revenue }) => {
        if (month >= 1 && month <= 12) {
          monthlyRevenue[month - 1] = revenue;
        }
      });

      const total = monthlyRevenue.reduce((sum, v) => sum + v, 0);

      setYearlyTotal(total);

      setChartData((prev) => ({
        ...prev,
        datasets: [{ ...prev.datasets[0], data: monthlyRevenue }],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetRevenueTrend(selectedDate);
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark">
      <p className="text-base font-medium">Xu hướng doanh thu</p>
      <p className="text-3xl font-bold truncate">
        {yearlyTotal.toLocaleString("vi-VN")}đ
      </p>
      <div className="flex gap-1">
        <p className="text-text-muted-light dark:text-text-muted-dark text-sm">
          Năm {selectedDate.getFullYear()}
        </p>
      </div>
      <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
        <Line data={chartData} options={options} width={1000} />
      </div>
    </div>
  );
}

export default RevenueTrend;
