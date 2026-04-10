import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { FaStar } from "react-icons/fa6";

import { getPendingReviews, moderateReview } from "../../api/reviewApi";

import { ReviewType } from "../../types/ReviewType";

import { RootState } from "../../redux/auth/authStore";

function ReviewApproval() {
  const account = useSelector((state: RootState) => state.auth.user);

  const [dataPendingReviews, setDataPendingReviews] = useState<ReviewType[]>(
    [],
  );

  const handleGetDatePendingReviews = async () => {
    try {
      const resReview = await getPendingReviews();
      setDataPendingReviews(resReview.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModerateReview = async (
    id: number,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      if (!account) return;

      await moderateReview(id, {
        adminId: account.accountId,
        status,
      });

      handleGetDatePendingReviews();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetDatePendingReviews();
  }, []);

  return (
    <div className="mt-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
      <h3 className="text-lg font-bold mb-4">Đánh giá cần duyệt</h3>

      <div className="flex flex-col gap-5">
        {dataPendingReviews.slice(0, 5).map((review) => {
          return (
            <div className="flex gap-4">
              <img
                src={
                  review.user.avatar ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBxrLoqLFpB8QTbz10BVp9re0BgLeyMwDeAjg9-_dH3WOgLIBoSKfyY6XVIYlIaLDrkNHW8dHWnGOQZ_MMaDyRiND99aciTEdfiH7MdNJhxUJYiwWRXMpcSDHN16X0EDwWsVIi6DU6AwBJyipuRJHgoU9NS5nI_ZCLYqkgGkT5zT-64PaTPELwUWnxFmwr3hM1KFbK7JOi3BrggcA5vwxRptag4PFN97bznwZNDJ9ToxOTRdbcRoeHa1SISxPn9iIDMsZEHTG6fBAY"
                }
                className="rounded-full size-10 object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{review.user.name}</p>
                <div className="flex items-center gap-1 mt-1 text-yellow-500 text-sm">
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
                </div>
                <div className="flex items-center gap-3 mt-2 p-2 border rounded-lg">
                  <img
                    src={review.product.imageProduct}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <p className="text-sm font-medium">{review.product.name}</p>
                </div>
                <p className="text-xs mt-2 text-text-muted-light dark:text-text-muted-dark">
                  {review.content}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleModerateReview(review.id, "APPROVED")}
                    className="text-xs px-3 py-1 bg-primary/20 text-success rounded-md hover:bg-primary/30"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => handleModerateReview(review.id, "REJECTED")}
                    className="text-xs px-3 py-1 bg-danger/20 text-danger rounded-md hover:bg-danger/30"
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewApproval;
