import Header from "../../components/common/Header";

import { IoSearchSharp } from "react-icons/io5";

import { useNavigate } from "react-router-dom";
import ReviewList from "../../components/review/ReviewList";
import Button from "../../components/common/Button";
import { FaStar } from "react-icons/fa6";
import { useState } from "react";

function ReviewPage() {
  const navigate = useNavigate();

  const [isShowStar, setIsShowStar] = useState(true);

  const [rating, setRating] = useState<number | null>(null);

  return (
    <>
      <Header
        title="Quản lý đánh giá"
        content="Quản lý tất cả đánh giá của người dùng"
      />
      <div className="mt-8">
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
          <div className="p-6 border-b border-border-light dark:border-border-dark">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <label className="relative flex-1 w-full sm:max-w-xs">
                <IoSearchSharp className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
                  placeholder="Tìm theo khách / sản phẩm..."
                />
              </label>
              <div className="flex items-center gap-2">
                <select className="p-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                  <option>Tất cả trạng thái</option>
                  <option>Chờ duyệt</option>
                  <option>Đã duyệt</option>
                  <option>Đã từ chối</option>
                </select>
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsShowStar((prev) => !prev);
                    }}
                    className="p-2 border rounded-lg flex items-center gap-2"
                  >
                    {rating} <FaStar className="text-yellow-400" />
                  </button>
                  <ul
                    className={`${isShowStar ? "hidden" : ""} absolute bg-white shadow rounded mt-2`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <li
                        onClick={() => {
                          setIsShowStar(false);
                          setRating((prev) => (prev === star ? null : star));
                        }}
                        key={star}
                        className="p-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {star}
                        <FaStar className="text-yellow-400" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <ReviewList />
          <div className="p-6 flex items-center justify-between">
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Hiển thị 1-8 trên 125 đơn hàng
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark hover:bg-primary/20 text-sm font-medium">
                Trước
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark hover:bg-primary/20 text-sm font-medium">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewPage;
