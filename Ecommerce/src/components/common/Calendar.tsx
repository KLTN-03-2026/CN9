import { useState } from "react";

import {
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  addMonths,
  isSameDay,
} from "date-fns";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

interface CalendarProps {
  today: Date;
  onSelectDate?: (date: Date) => void;
}

function Calendar({ today, onSelectDate }: CalendarProps) {
  const colStart = [
    "col-start-1",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
  ];

  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const startTime = currentMonth;
  const endTime = endOfMonth(currentMonth);

  const days = eachDayOfInterval({ start: startTime, end: endTime });

  const startWeekday = startTime.getDay();

  const handleSelectDate = (day: Date) => {
    const newSelected = selectedDate && isSameDay(day, selectedDate) ? null : day;
    setSelectedDate(newSelected);
    onSelectDate?.(newSelected ?? today);
  };

  return (
    <div className="top-8 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4">
      <div className="flex min-w-72 flex-1 flex-col">
        <div className="flex items-center p-1 justify-between">
          <button
            className="hover:bg-primary/20 rounded-full p-1"
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          >
            <FaAngleLeft className="flex items-center justify-center text-lg" />
          </button>
          <p className="text-base font-bold flex-1 text-center">
            {`Tháng ${
              currentMonth.getMonth() + 1
            } ${currentMonth.getFullYear()}`}
          </p>
          <button
            className="hover:bg-primary/20 rounded-full p-1"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <FaAngleRight className="flex items-center justify-center text-lg" />
          </button>
        </div>

        <div className="grid grid-cols-7">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (
            <p
              key={d}
              className="text-text-muted-light dark:text-text-muted-dark text-xs font-bold flex h-10 w-full items-center justify-center"
            >
              {d}
            </p>
          ))}

          {days.map((day, i) => {
            const isToday = isSameDay(day, today);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleSelectDate(day)}
                className={`h-10 w-full ${
                  i === 0 ? colStart[startWeekday] : ""
                } text-sm font-medium`}
              >
                <div
                  className={`flex size-full items-center justify-center rounded-full transition-colors
                    ${isSelected
                      ? "bg-primary/80 text-white ring-2 ring-primary ring-offset-1"
                      : isToday
                      ? "bg-primary text-white"
                      : "hover:bg-primary/20"
                    }`}
                >
                  {day.getDate()}
                </div>
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark text-center">
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              Đã chọn:{" "}
              <span className="font-semibold text-primary">
                {selectedDate.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
