import { Modal } from "antd";

import { useEffect, useRef, useState } from "react";

import { FaStar } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

import { createReview } from "../../api/reviewApi";
import type { OrderItemType, OrderType } from "../../type/OrderType";
import type { UploadFile } from "../../type/UploadType";

interface ReviewFormProps {
  items: OrderItemType[];
  isComment: boolean;
  order: OrderType;
  onToggleComment: (id: number) => void;
}

function ReviewForm({
  isComment,
  onToggleComment,
  order,
  items,
}: ReviewFormProps) {
  const inputRefImage = useRef<HTMLInputElement | null>(null);

  const [hover, setHover] = useState(0);

  const [imagesSrcReview, setImagesSrcReview] = useState<UploadFile[]>([]);

  const [inputComment, setInputComment] = useState<{
    rating: number;
    content: string;
    images: string[];
  }>({ content: "", rating: 0, images: [] });

  const [currentIndex, setCurrentIndex] = useState(0);

  const [disableInput, setDisableInput] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputComment, string>>
  >({});

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (!isComment || !items[currentIndex].review) return;

    setInputComment({
      content: currentItem.review.content,
      rating: currentItem.review.rating,
      images: currentItem.review.images,
    });
    setDisableInput(true);
  }, [isComment]);

  const readFileAsync = (file: File): Promise<UploadFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve({ file, preview: e.target.result as string });
        } else {
          reject("Lỗi đọc file");
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files);
      const results: UploadFile[] = [];
      for (const file of fileArray) {
        try {
          const result = await readFileAsync(file);
          results.push(result);
        } catch (err) {
          console.error("Lỗi đọc file:", err);
        }
      }
      const array = results.reverse();
      setImagesSrcReview((prev) =>
        prev.length >= 5 ? prev : [...prev, ...array],
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagesSrcReview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReivew = async (orderId: number) => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputComment.content) {
        newErrors.content = "Vui lòng nhập nội dung đánh giá";
      }

      if (!inputComment.rating) {
        newErrors.rating = "Vui lòng chọn sao với mức độ hài lòng với sản phẩm";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const formData = new FormData();

      formData.append("rating", inputComment.rating.toString());

      formData.append("comment", inputComment.content.toString());

      formData.append("orderItemId", orderId.toString());

      formData.append("productId", currentItem.productId.toString());

      if (imagesSrcReview.length >= 0) {
        imagesSrcReview.forEach((_, i) => {
          formData.append("reivewImage", imagesSrcReview[i].file);
        });
      }

      const resReview = await createReview(formData);
      console.log(resReview);
    } catch (error) {
      console.log(error);
    }
  };

  function handleResetReview() {
    onToggleComment(order.id);
    setInputComment({ content: "", rating: 0, images: [] });
    setImagesSrcReview([]);
  }
  return (
    <Modal
      open={isComment}
      closable={false}
      footer={
        <div className="px-6 py-4 bg-background-light dark:bg-background-dark/30 border-t border-border-light dark:border-border-dark flex gap-3 justify-end">
          <button
            onClick={() => handleResetReview()}
            className="px-6 py-2 rounded-lg text-sm font-bold text-text-light-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              handleSubmitReivew(order.id);
              if (currentIndex + 1 === items.length) {
                onToggleComment(order.id);
              } else {
                setCurrentIndex((prev) => prev + 1);
              }
            }}
            className="px-8 py-2 bg-primary rounded-lg text-sm font-bold text-text-light-primary hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Gửi đánh giá
          </button>
        </div>
      }
    >
      <div className="p-6 flex flex-col gap-6">
        <div className="flex gap-4 items-center bg-background-light dark:bg-background-dark/50 p-3 rounded-xl border border-border-light dark:border-border-dark">
          <img
            alt="Product"
            className="w-16 h-16 object-cover rounded-lg"
            src={currentItem.imageVariant}
          />
          <div>
            <h4 className="font-semibold text-text-light-primary dark:text-text-dark-primary leading-tight">
              {currentItem.name}
            </h4>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Bạn cảm thấy sản phẩm này thế nào?
          </p>

          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={20}
                onMouseEnter={() => {
                  if (disableInput) return;
                  setHover(star);
                }}
                onMouseLeave={() => {
                  if (disableInput) return;
                  setHover(0);
                }}
                onClick={() => {
                  if (disableInput) return;
                  setInputComment((prev) => ({
                    ...prev,
                    rating: star,
                  }));
                }}
                className={`mr-1 cursor-pointer transition-colors duration-200 ${
                  star <= (hover || inputComment.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Nội dung nhận xét
          </label>
          <textarea
            className="w-full min-h-[120px] p-3 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-text-light-secondary/50"
            placeholder="Chia sẻ cảm nhận của bạn về chất lượng sản phẩm, dịch vụ giao hàng nhé..."
            value={inputComment.content}
            disabled={disableInput}
            onChange={(e) => {
              setInputComment((prev) => ({
                ...prev,
                content: e.target.value,
              }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
            Hình ảnh &amp; Video thực tế (tối đa 5 hình)
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => inputRefImage.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-border-light dark:border-border-dark flex flex-col items-center justify-center gap-1 text-text-light-secondary hover:border-primary hover:text-primary transition-all group"
            >
              <MdAddAPhoto className="text-2xl" />
              <span className="text-[10px] font-bold">Thêm</span>
              <input
                ref={inputRefImage}
                className="hidden"
                multiple
                disabled={disableInput}
                type="file"
                onChange={handleFile}
              />
            </button>
            {inputComment.images.length !== 0
              ? inputComment.images.map((imageReview, i) => {
                  return (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-xl overflow-hidden group"
                    >
                      <img
                        alt="Preview"
                        className="w-full h-full object-cover"
                        src={imageReview}
                      />
                      <button
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <IoMdClose className="!text-xs leading-none" />
                      </button>
                    </div>
                  );
                })
              : imagesSrcReview.map((imageReview, i) => {
                  return (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-xl overflow-hidden group"
                    >
                      <img
                        alt="Preview"
                        className="w-full h-full object-cover"
                        src={imageReview.preview}
                      />
                      <button
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <IoMdClose className="!text-xs leading-none" />
                      </button>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ReviewForm;
