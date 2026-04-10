import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const labels = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
];

const data = {
  labels,
  datasets: [
    {
      data: [30, 50, 40, 70, 80, 40, 20, 10, 50, 90, 70, 80],
      borderColor: "#0ff047",
      backgroundColor: "rgba(15, 240, 71, 0.15)",
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "#0ff047",
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index" as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(231, 243, 234, 0.5)",
        lineWidth: 1,
      },
      border: { dash: [4, 4] },
      ticks: { color: "#9ca3af" },
    },
    y: {
      grid: {
        color: "rgba(231, 243, 234, 0.5)",
        lineWidth: 1,
      },
      border: { dash: [4, 4] },
      ticks: { color: "#9ca3af" },
      display: false,
    },
  },
};

const RevenueChart = () => {
  return (
    <div className="mt-4 flex min-h-[300px] w-full items-end justify-center">
      <Line data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
