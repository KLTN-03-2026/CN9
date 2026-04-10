import { DashboardItemType, TrendType } from "../../types/DashboardType";

interface InfoBoardsProps {
  title: string;
  content: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: TrendType;
  type?: DashboardItemType;
}

function InfoBoards({
  title,
  content,
  value,
  icon,
  trend,
  type,
}: InfoBoardsProps) {
  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
        ? "text-danger"
        : "text-gray-400";

  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
      <div className="flex items-center justify-between">
        <p className="text-base font-medium text-text-muted-light dark:text-text-muted-dark">
          {title}
        </p>
        <div className="p-2 rounded-full bg-primary/20">{icon}</div>
      </div>
      <p className="text-3xl font-bold">
        {value}
        {type === "currency" ? "đ" : ""}
      </p>
      <p className={`text-sm font-medium ${trendColor}`}>{content}</p>
    </div>
  );
}

export default InfoBoards;
