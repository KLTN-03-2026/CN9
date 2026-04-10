import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Mỹ phẩm", value: 40 },
  { name: "Thời trang", value: 25 },
  { name: "Điện tử", value: 15 },
  { name: "Gia dụng", value: 10 },
  { name: "Khác", value: 10 },
];

const COLORS = ["#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#dcfce7"];

export default function DonutChart() {
  return (
    <div className="relative w-[300px] h-[300px]">
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80} // tạo lỗ ở giữa
          outerRadius={120}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>

      {/* Text ở giữa */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">40%</span>
        <span className="text-green-600">Mỹ phẩm</span>
      </div>
    </div>
  );
}
