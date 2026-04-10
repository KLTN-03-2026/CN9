import { FaStar } from "react-icons/fa";
import type { DetailProductType } from "../../type/ProductType";


interface ReviewListProps {
  dataDetailProduct: Partial<DetailProductType>;
}

function ReviewList({ dataDetailProduct }: ReviewListProps) {
  return (
    <div className="mt-12 lg:mt-16" id="reviews">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Đánh giá của khách hàng
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-primary/10 dark:bg-primary/20">
          <p className="text-5xl font-extrabold text-gray-900 dark:text-white">
            4.5
          </p>
          <div className="flex items-center my-2 text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={20}
                className={`mr-1 ${
                  star <= (dataDetailProduct.ratingSummary?.average || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Dựa trên {dataDetailProduct.ratingSummary?.total} đánh giá
          </p>
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = dataDetailProduct.ratingSummary?.stars[star] || 0;
            const percent = dataDetailProduct.ratingSummary?.total
              ? (count / dataDetailProduct.ratingSummary?.total) * 100
              : 0;

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm font-medium">{star} sao</span>

                <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-yellow-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-6">
        {dataDetailProduct.reviews?.map((review) => {
          return (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={
                    review.avatar ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuA5mo65JZvjKp6Szj-9f6BMvLAMW89ZuWAlR7dfbBBRLzLgk-3ui66PriRFoPiKVS1Ie7mLTCDItRYvtv72cHYjgEySRDtmZ6iWZshlG5dhl-8b0IrV54im9IxSeR4qbQ6iOFYCRyyaZIYwjO_LX_rIYaamw7Yx3A3-bwSvFaqJ7NGNu_fqbOdS2WSil1TSr2G64iwa8o9_Cz5oU1EmTThK01_-lzYYkx1UwqE44JQRfQGn9zTv9mJLzeyDQt97Et6WwCNx-9yOXhs"
                  }
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  alt=""
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {review.username}
                  </p>
                  <div className="flex items-center text-yellow-500">
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
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {review.content}
              </p>
            </div>
          );
        })}
      </div>
      {dataDetailProduct.reviews?.length === 0? (
        <></>
      ) : (
        <div className="mt-8 text-center">
          <button className="flex max-w-sm mx-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary/20 text-gray-800 dark:text-gray-200 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-6 hover:bg-primary/30 transition-colors">
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewList;
