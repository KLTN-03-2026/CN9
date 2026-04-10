import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { FaRegCheckCircle } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { IoIosInformationCircleOutline, IoMdClose } from "react-icons/io";
import { MdDeleteOutline, MdOutlineSchedule } from "react-icons/md";
import { IoSend } from "react-icons/io5";

import {
  getReviewById,
  moderateReview,
  replyToReview,
} from "../../api/reviewApi";

import { ReviewDetailType } from "../../types/ReviewType";

import { RootState } from "../../redux/auth/authStore";

interface ReviewDetailProps {
  reviewId: number | null;
  setReviewId: React.Dispatch<React.SetStateAction<number | null>>;
  isShowReviewDetail: boolean;
  setIsShowReviewDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReviewDetail({
  reviewId,
  isShowReviewDetail,
  setIsShowReviewDetail,
}: ReviewDetailProps) {
  const [dataReviewDetail, setDataReviewDetail] =
    useState<ReviewDetailType | null>(null);

  const [inputReply, setInputReply] = useState<{ admin: string }>({
    admin: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputReply, string>>
  >({});

  const account = useSelector((state: RootState) => state.auth.user);

  const handleGetDataReviewDetail = async (reviewId: number) => {
    try {
      const resReview = await getReviewById(reviewId);
      setDataReviewDetail(resReview.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!reviewId) return;

    handleGetDataReviewDetail(reviewId);
  }, [reviewId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const time = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const day = date.toLocaleDateString("vi-VN");

    return `Đăng lúc ${time} - ${day}`;
  };

  const handleReplyReview = async (id: number) => {
    try {
      if (!account) return;

      const newErrors: Partial<typeof errors> = {};

      if (!inputReply.admin) {
        newErrors.admin = "Vui lòng nhập câu trả lời";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const resReply = await replyToReview(id, {
        adminId: account.accountId,
        content: inputReply.admin,
      });

      console.log(resReply);
      handleGetDataReviewDetail(id);
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
    } catch (error) {
      console.log(error);
    }
  };

  if (!dataReviewDetail) {
    return null;
  }

  return (
    <Modal
      styles={{ container: {} }}
      width={"700px"}
      open={isShowReviewDetail}
      closable={false}
      onCancel={() => setIsShowReviewDetail(false)}
      footer={null}
    >
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Chi tiết đánh giá
          </h2>
          <button
            onClick={() => setIsShowReviewDetail(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <IoMdClose size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <img
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-gray-600"
                src={dataReviewDetail.user.avatar}
              />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                  Khách hàng
                </p>
                <p className="text-base font-semibold text-gray-800 dark:text-white">
                  {dataReviewDetail.user.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <img
                className="w-12 h-12 rounded-lg object-cover ring-2 ring-white dark:ring-gray-600"
                src={dataReviewDetail.product.imageProduct}
              />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                  Sản phẩm
                </p>
                <p className="text-base font-semibold text-gray-800 dark:text-white">
                  {dataReviewDetail.product.name}
                </p>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="flex items-center space-x-1 mb-2">
              <span className="flex items-center mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={20}
                    className={`mr-1 ${
                      star <= dataReviewDetail.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </span>
              <span className="ml-3 text-lg font-bold text-gray-800 dark:text-white">
                {dataReviewDetail.rating}/5
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
              <MdOutlineSchedule className="text-sm mr-1" />
              {formatDate(dataReviewDetail.createdAt)}
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic">
              {dataReviewDetail.content}
            </p>
          </div>
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 uppercase tracking-wide">
              Hình ảnh thực tế
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {dataReviewDetail.images.map((image) => {
                return (
                  <div className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square">
                    <img
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      src={image}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {dataReviewDetail.shopReply ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <IoIosInformationCircleOutline className="text-slate-500 text-sm" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Phản hồi từ cửa hàng
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {dataReviewDetail.shopReply}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <label
                className="block text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wide"
                htmlFor="admin-response"
              >
                Phản hồi từ cửa hàng
              </label>
              <textarea
                className="block w-full px-4 py-3 text-gray-800 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-primary focus:border-primary transition-all placeholder-gray-400 dark:text-white"
                id="admin-response"
                placeholder="Nhập nội dung phản hồi khách hàng tại đây..."
                rows={4}
                name="admin"
                value={inputReply.admin}
                onChange={(e) =>
                  setInputReply((prev) => ({ ...prev, admin: e.target.value }))
                }
              />
              <p className="text-red-500 font-medium">{errors.admin}</p>
              <button
                onClick={() => handleReplyReview(dataReviewDetail.id)}
                className="mt-2 flex items-center px-8 py-2.5 rounded-xl bg-primary text-white hover:bg-emerald-600 font-semibold shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
              >
                <IoSend className="mr-2 text-lg" />
                Trả lời
              </button>
            </div>
          )}
        </div>
        <div className="px-6 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-3 items-center justify-end">
          <button className="flex items-center px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-all mr-auto">
            <MdDeleteOutline className="mr-2 text-lg" />
            Xóa
          </button>
          {dataReviewDetail.status === "REJECTED" ||
          dataReviewDetail.status === "APPROVED" ? (
            <></>
          ) : (
            <>
              <button
                onClick={() =>
                  handleModerateReview(dataReviewDetail.id, "REJECTED")
                }
                className="flex items-center px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all"
              >
                Từ chối
              </button>
              <button
                onClick={() =>
                  handleModerateReview(dataReviewDetail.id, "APPROVED")
                }
                className="flex items-center px-8 py-2.5 rounded-xl bg-primary text-white hover:bg-emerald-600 font-semibold shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
              >
                <FaRegCheckCircle className="mr-2 text-lg" />
                Duyệt đánh giá
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ReviewDetail;
