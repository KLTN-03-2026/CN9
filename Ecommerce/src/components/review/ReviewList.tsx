import { FaStar } from "react-icons/fa6";
import { TbArrowForward } from "react-icons/tb";

import ButtonIconDelete from "../common/ButtonIconDelete";

import { getAllReviews } from "../../api/reviewApi";

import { useEffect, useState } from "react";

import { ReviewType } from "../../types/ReviewType";
import ReviewDetail from "./ReviewDetail";

interface ReviewListProps {}

function ReviewList({}: ReviewListProps) {
  const [dataReviews, setDataReviews] = useState<ReviewType[]>([]);

  const [reviewId, setReviewId] = useState<number | null>(null);

  const [isShowReviewDetail, setIsShowReviewDetail] = useState(false);

  const handleGetAllReviews = async () => {
    try {
      const resReviews = await getAllReviews();
      setDataReviews(resReviews.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllReviews();
  }, []);

  const reviewStatusConfig = {
    PENDING: {
      label: "Chờ duyệt",
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    },
    APPROVED: {
      label: "Đã duyệt",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    REJECTED: {
      label: "Đã từ chối",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-muted-light dark:text-text-muted-dark">
            <th className="py-3 px-4 font-medium">Khách hàng</th>
            <th className="py-3 px-4 font-medium">Sản phẩm</th>
            <th className="py-3 px-4 font-medium">Đánh giá</th>
            <th className="py-3 px-4 font-medium">Ngày đăng</th>
            <th className="py-3 px-4 font-medium">Trạng thái</th>
            <th className="py-3 px-4 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {dataReviews.map((review) => {
            return (
              <tr
                key={review.id}
                className="border-b border-border-light dark:border-border-dark"
              >
                <td className="py-3 px-4 font-medium">{review.user.name}</td>
                <td className="py-3 px-4 flex items-center">
                  <img
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 mr-2"
                    src={review.product.imageProduct}
                    alt=""
                  />
                  <p>{review.product.name}</p>
                </td>
                <td className="py-3 px-4" style={{ width: 400 }}>
                  <span className="flex items-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={20}
                        className={`mr-1 ${
                          star <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1">({review.rating})</span>
                  </span>
                  <span>{review.content}</span>
                </td>
                <td className="py-3 px-4">12/05/2024</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      reviewStatusConfig[review.status].className
                    }`}
                  >
                    {reviewStatusConfig[review.status].label}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => {
                      setIsShowReviewDetail(true);
                      setReviewId(review.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-primary/20"
                  >
                    <TbArrowForward className="text-lg" />
                  </button>
                  <ButtonIconDelete />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ReviewDetail
        reviewId={reviewId}
        setReviewId={setReviewId}
        isShowReviewDetail={isShowReviewDetail}
        setIsShowReviewDetail={setIsShowReviewDetail}
      />
    </div>
  );
}
export default ReviewList;
