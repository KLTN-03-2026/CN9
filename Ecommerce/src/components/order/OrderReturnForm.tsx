import { Modal } from "antd";

import { IoClose } from "react-icons/io5";
import {
  MdChatBubbleOutline,
  MdOutlineAssignmentReturn,
  MdOutlineZoomIn,
} from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import { BiSolidZap } from "react-icons/bi";

import React, { useState } from "react";

import { ReturnType } from "../../types/ReturnType";

import { approveReturnByAdminId } from "../../api/returnApi";

import { formatMoneyString } from "../../utils/formatPrice";

import OrderRefundForm from "./OrderRefundForm";

interface OrderReturnFormProps {
  isShowReturn: boolean;
  returnData: ReturnType;
  orderItemId: number;
  priceReturn: number;
  setIsShowReturn: React.Dispatch<React.SetStateAction<boolean>>;
}

function OrderReturnForm({
  isShowReturn,
  returnData,
  orderItemId,
  priceReturn,
  setIsShowReturn,
}: OrderReturnFormProps) {
  const [inputReturn, setInputReturn] = useState<{ adminNote: string }>({
    adminNote: "",
  });

  const [overlayRefund, setOverlayRefund] = useState(false);

  const [RefundMethod, setRefundMethod] = useState<string>("");

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputReturn, string>>
  >({});

  const RETURN_STATUS_UI = {
    APPROVED: {
      icon: <FaRegCheckCircle />,
      title: "Phê duyệt Hoàn trả Thành công",
      description: "Yêu cầu hoàn tiền đã được xử lý",
      badge: "Đã phê duyệt",
      bgIcon: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-500",
      badgeStyle:
        "bg-green-100 text-green-600 border-green-200 dark:bg-green-900/30 dark:border-green-800",
    },
    REJECTED: {
      icon: <ImCancelCircle />,
      title: "Đã từ chối yêu cầu trả hàng",
      description: "Yêu cầu trả hàng đã được xử lý",
      badge: "Đã từ chối",
      bgIcon: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-500",
      badgeStyle:
        "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-800",
    },
  } as const;

  const ui = RETURN_STATUS_UI[returnData.status as "APPROVED" | "REJECTED"];

  const handleSubmitReturnRequest = async (status: "APPROVED" | "REJECTED") => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputReturn.adminNote) {
        newErrors.adminNote =
          "Admin vui lòng nhập lý do hủy hay đồng ý hoàn hàng";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const resReturn = await approveReturnByAdminId(returnData.id, {
        status,
        adminNote: inputReturn.adminNote,
      });

      console.log(resReturn);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        open={isShowReturn}
        closable={false}
        onCancel={() => setIsShowReturn(false)}
        footer={
          returnData.status === "PENDING" ? (
            <div className="py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleSubmitReturnRequest("REJECTED")}
                className="flex-1 bg-white dark:bg-slate-900 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 order-2 sm:order-1"
              >
                <IoClose className="text-lg" />
                Từ chối yêu cầu
              </button>
              <button
                onClick={() => handleSubmitReturnRequest("APPROVED")}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                <FaRegCheckCircle className="text-lg" />
                Chấp nhận &amp; Hoàn tiền
              </button>
            </div>
          ) : returnData.status !== "REJECTED" ? (
            <footer className="p-6 pt-2 bg-white border-t border-gray-50 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setOverlayRefund(true);
                  setRefundMethod("");
                }}
                className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
                data-purpose="manual-refund-btn"
                type="button"
              >
                Hoàn trả thủ công
              </button>
              {/* {paymentMethod === "VNPAY" ? (
                <button
                  onClick={() => {
                    setOverlayRefund(true);
                    setRefundMethod(paymentMethod);
                  }}
                  className="flex-1 px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 text-sm"
                  data-purpose="auto-refund-btn"
                  type="button"
                >
                  <BiSolidZap />
                  Hoàn trả tự động
                </button>
              ) : (
                <></>
              )} */}
            </footer>
          ) : (
            <></>
          )
        }
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          {returnData.status === "PENDING" ? (
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                <MdOutlineAssignmentReturn className="text-orange-500" />
                Phê duyệt trả hàng: {orderItemId}
              </h3>
              <button
                onClick={() => setIsShowReturn(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <IoClose />
              </button>
            </div>
          ) : (
            <>
              <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${ui.bgIcon}`}
                >
                  <span
                    className={`material-icons-round text-5xl ${ui.iconColor}`}
                  >
                    {ui.icon}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {ui.title}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {ui.description}
                </p>
                <div className="mt-4 flex justify-center">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${ui.badgeStyle}`}
                  >
                    {ui.badge}
                  </span>
                </div>
              </div>
            </>
          )}
          <div className="px-6 pb-6 space-y-6">
            <div className="space-y-4">
              <section className="text-center py-2">
                <p className="text-slate-500 text-sm mb-1">
                  Tổng tiền hoàn trả
                </p>
                <div className="text-3xl font-black text-slate-900">
                  {formatMoneyString(String(priceReturn))}đ
                </div>
              </section>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <IoIosInformationCircleOutline className="text-slate-500 text-sm" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Lý do khách hàng đưa ra
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {returnData.reason}
                </p>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Hình ảnh bằng chứng (3)
                </label>
                <div className="flex gap-3">
                  {returnData.imageReturn.map((image) => {
                    return (
                      <div className="w-24 aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 relative group cursor-zoom-in">
                        <img
                          className="w-full h-full object-cover"
                          src={image}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <MdOutlineZoomIn className="text-white text-sm" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {returnData.adminNote ? (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <IoIosInformationCircleOutline className="text-slate-500 text-sm" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Lời nhắn cho khách hàng
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {returnData.adminNote}
                </p>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <MdChatBubbleOutline className="text-sm" />
                  Lời nhắn cho khách hàng
                </label>
                <textarea
                  name="adminNote"
                  value={inputReturn.adminNote}
                  onChange={(e) =>
                    setInputReturn((prev) => ({
                      ...prev,
                      adminNote: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent p-4 placeholder:text-slate-400 min-h-[100px]"
                  placeholder="Điền phản hồi của Admin về yêu cầu trả hàng này..."
                />
                <p className="text-red-500 font-medium">{errors.adminNote}</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
      {overlayRefund && (
        <OrderRefundForm
          setOverlayRefund={setOverlayRefund}
          paymentMethood={RefundMethod}
          refundId={returnData.refundId}
          priceReturn={priceReturn}
        />
      )}
    </>
  );
}

export default OrderReturnForm;
