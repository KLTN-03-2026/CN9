import { FaFileDownload, FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineExpandMore } from "react-icons/md";
import Calendar from "../common/Calendar";
import { useState } from "react";
import Button from "../common/Button";

function ButtonForHeader() {
  const [isShowCalendar, setIsShowCalendar] = useState<boolean>(false);

  return (
    <div className="flex items-center gap-4">
      {/* <div className="relative">
        <button
          className="flex items-center gap-2 pl-4 pr-3 py-2 text-sm font-medium rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:bg-primary/10"
          onClick={() => setIsShowCalendar((prev) => !prev)}
        >
          <FaRegCalendarAlt className="text-lg" />
          <span>Tháng này</span>
          <MdOutlineExpandMore className="text-lg" />
        </button>
        <div
          className={`${isShowCalendar ? "" : "hidden "}absolute right-0 mt-2`}
        >
          <Calendar />
        </div>
      </div> */}
      <Button
        title="Xuất báo cáo"
        icon={<FaFileDownload className="text-lg" />}
        onClick={() => {}}
      />
    </div>
  );
}

export default ButtonForHeader;
