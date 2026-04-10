import { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import {
  MdAddShoppingCart,
  MdArrowBackIosNew,
  MdArrowForwardIos,
} from "react-icons/md";
import { TbCreditCardFilled } from "react-icons/tb";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../../api/productApi";
import { formatMoneyString } from "../../utils/formatPrice";
import { useDispatch } from "react-redux";
import { addItem } from "../../redux/cart/cartSlice";
import { addProductToCart } from "../../api/cartApi";
import ReviewList from "../../components/detail/ReviewList";
import RelatedProducts from "../../components/detail/RelatedProducts";
import type { DetailProductType } from "../../type/ProductType";

function ProductDetailPage() {
  const { slug } = useParams();

  const [dataDetailProduct, setDataDetailProduct] = useState<
    Partial<DetailProductType>
  >({});

  const [selectedImage, setSelectedImage] = useState<number>(0);

  const [selectedColor, setSelectedColor] = useState<number | null>(null);

  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const [valueProduct, setValueProduct] = useState<number>(1);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [valueColor, setValueColor] = useState<string>("");

  const dispatch = useDispatch();

  const handleGetDataDetailProduct = async (slug: string) => {
    try {
      const resDetailPro = await getProductBySlug(slug);
      setDataDetailProduct(resDetailPro.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!slug) return;
    handleGetDataDetailProduct(slug);
  }, []);

  const image_product = useMemo<string[]>(() => {
    return Array.isArray(dataDetailProduct.image_url)
      ? dataDetailProduct.image_url
      : [];
  }, [dataDetailProduct.image_url]);

  const validSizeIdsByColor = useMemo<number[]>(() => {
    if (!selectedColor) return [];

    return (
      dataDetailProduct.variants
        ?.filter((v) => v.color.id === selectedColor)
        .map((v) => v.size.id) || []
    );
  }, [dataDetailProduct.variants, selectedColor]);

  const validColorIdsBySize = useMemo<number[]>(() => {
    if (!selectedSize) return [];

    return (
      dataDetailProduct.variants
        ?.filter((v) => v.size.id === selectedSize)
        .map((v) => v.color.id) || []
    );
  }, [dataDetailProduct.variants, selectedSize]);

  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;

    return dataDetailProduct.variants?.find(
      (v) => v.color.id === selectedColor && v.size.id === selectedSize,
    );
  }, [dataDetailProduct.variants, selectedColor, selectedSize]);

  const stock = selectedVariant
    ? selectedVariant.stock
    : (dataDetailProduct.variants?.reduce((s, v) => s + v.stock, 0) ?? 0);

  const handleSelectedColor = (colorId: number) => {
    setSelectedColor((prev) => (prev === colorId ? null : colorId));

    const variantsByColor =
      dataDetailProduct.variants?.filter(
        (variant) => variant.color.id === colorId,
      ) || [];

    const nameColor = variantsByColor[0].color.name_color;
    setValueColor((prev) => (prev === nameColor ? "" : nameColor));

    const image = variantsByColor[0]?.image_url;
    if (!image) return;

    const index =
      dataDetailProduct.image_url?.findIndex((item) => item.includes(image)) ??
      0;

    setSelectedImage(index !== -1 ? index : 0);
  };

  const handleAddIteamForCart = async () => {
    const getDataVariant = dataDetailProduct.variants?.find(
      (v) => v.color.id === selectedColor && v.size.id === selectedSize,
    );

    if (!getDataVariant) return;

    dispatch(
      addItem({
        color: getDataVariant.color.name_color,
        image_url: getDataVariant.image_url,
        name: dataDetailProduct.name!,
        price:
          dataDetailProduct.sale && dataDetailProduct.price
            ? dataDetailProduct.sale.discount_type === "fixed"
              ? dataDetailProduct.price - dataDetailProduct.sale.discount_value
              : dataDetailProduct.price -
                dataDetailProduct.price *
                  (dataDetailProduct.sale.discount_value / 100)
            : dataDetailProduct.price!,
        productId: dataDetailProduct.id!,
        quantity: valueProduct,
        size: getDataVariant.size.Symbol,
        variantId: getDataVariant.id,
        isChecked: false,
        sale: dataDetailProduct.sale,
      }),
    );

    await addProductToCart(getDataVariant.id, valueProduct);
  };

  return (
    <main className="layout-container flex h-full grow flex-col">
      <div className="container mx-auto px-4 py-8">
        <div className="layout-content-container flex flex-col w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex flex-col gap-4">
              <img
                src={image_product[selectedImage]}
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl shadow-sm"
              />
              <div className="relative">
                <MdArrowBackIosNew
                  size={30}
                  onClick={() =>
                    setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1))
                  }
                  className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 p-1 rounded-full shadow cursor-pointer"
                />
                <div className="grid grid-cols-4 gap-4">
                  {image_product
                    .slice(currentIndex, currentIndex + 4)
                    .map((img, i) => {
                      return (
                        <img
                          src={img}
                          onClick={() => setSelectedImage(i)}
                          className={`w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg ${selectedImage === i ? "ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark" : "opacity-70 hover:opacity-100 transition-opacity"}  cursor-pointer`}
                        />
                      );
                    })}
                </div>
                <MdArrowForwardIos
                  size={30}
                  onClick={() => {
                    setCurrentIndex((prev) =>
                      prev >= image_product.length - 1 ? prev : prev + 1,
                    );
                  }}
                  className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 p-1 rounded-full shadow cursor-pointer"
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-gray-900 dark:text-white tracking-tight text-3xl font-extrabold leading-tight">
                  {dataDetailProduct.name}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={20}
                      className={`mr-1 ${
                        star <= (dataDetailProduct.ratingSummary?.average ?? 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  ({dataDetailProduct.ratingSummary?.total} đánh giá)
                </p>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatMoneyString(
                    String(
                      dataDetailProduct.sale && dataDetailProduct.price
                        ? dataDetailProduct.sale.discount_type === "fixed"
                          ? dataDetailProduct.price -
                            dataDetailProduct.sale.discount_value
                          : dataDetailProduct.price -
                            dataDetailProduct.price *
                              (dataDetailProduct.sale.discount_value / 100)
                        : dataDetailProduct.price,
                    ),
                  )}
                  ₫
                </span>
                {dataDetailProduct.sale ? (
                  <span className="text-xl font-medium text-gray-400 dark:text-gray-500 line-through">
                    {formatMoneyString(String(dataDetailProduct.price))}₫
                  </span>
                ) : (
                  <></>
                )}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700" />
              {/* Variant Selectors */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 block">
                    Màu sắc:{" "}
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {valueColor}
                    </span>
                  </label>
                  <div className="flex gap-3">
                    {dataDetailProduct.colors?.map((color) => {
                      const isValid =
                        !selectedSize || validColorIdsBySize.includes(color.id);

                      return (
                        <button
                          key={color.id}
                          disabled={!isValid}
                          onClick={() => handleSelectedColor(color.id)}
                          className={`w-8 h-8 rounded-full border        ${
                            !isValid
                              ? "opacity-30 cursor-not-allowed"
                              : "hover:ring-2 hover:ring-primary"
                          }        ${selectedColor === color.id ? "ring-2 ring-primary" : ""}`}
                          style={{ backgroundColor: color.hex }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 block">
                    Kích cỡ
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {dataDetailProduct.sizes?.map((size) => {
                      const isValid =
                        !selectedColor || validSizeIdsByColor.includes(size.id);

                      return (
                        <button
                          key={size.id}
                          disabled={!isValid}
                          onClick={() =>
                            isValid &&
                            setSelectedSize((prev) =>
                              prev === size.id ? null : size.id,
                            )
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-semibold        ${
                            isValid
                              ? "bg-primary/20 hover:bg-primary/30 cursor-pointer"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                          }        ${
                            selectedSize === size.id
                              ? "ring-2 ring-primary bg-primary text-gray-900"
                              : ""
                          }`}
                        >
                          {size.Symbol}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="text-sm font-semibold flex">
                <span>Số hàng tồn kho: </span> <p>{stock}</p>
              </div>
              {/* CTA Block */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center rounded-lg bg-primary/20">
                  <button
                    onClick={() =>
                      setValueProduct((prev) => (prev <= 1 ? 1 : prev - 1))
                    }
                    className="px-4 h-full text-gray-800 dark:text-gray-200 hover:bg-primary/30 rounded-l-lg transition-colors"
                  >
                    -
                  </button>
                  <input
                    className="w-12 text-center bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white font-semibold"
                    readOnly
                    type="text"
                    value={valueProduct}
                  />
                  <button
                    onClick={() =>
                      setValueProduct((prev) =>
                        prev >= stock ? prev : prev + 1,
                      )
                    }
                    className="px-4 h-full text-gray-800 dark:text-gray-200 hover:bg-primary/30 rounded-r-lg transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleAddIteamForCart()}
                  className="flex-1 flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-gray-900 gap-2 text-base font-bold tracking-wide min-w-0 px-6 hover:opacity-90 transition-opacity"
                >
                  <MdAddShoppingCart className="text-xl" />
                  <span>Thêm vào giỏ hàng</span>
                </button>
                <button className="flex-1 flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-gray-900 gap-2 text-base font-bold tracking-wide min-w-0 px-6 hover:opacity-90 transition-opacity">
                  <TbCreditCardFilled className="text-xl" />
                  <span>Mua</span>
                </button>
              </div>
            </div>
          </div>
          {/* Detailed Info & Reviews Tabs */}
          <div className="mt-12 lg:mt-16">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav aria-label="Tabs" className="-mb-px flex gap-6">
                <a
                  className="shrink-0 border-b-2 border-primary px-1 pb-4 text-sm font-semibold text-primary"
                  href="#"
                >
                  Mô tả chi tiết
                </a>
                <a
                  className="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200"
                  href="#reviews"
                >
                  Đánh giá ({dataDetailProduct.reviews?.length})
                </a>
              </nav>
            </div>
            <div className="py-8 text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              {dataDetailProduct.description}
            </div>
          </div>
          <ReviewList dataDetailProduct={dataDetailProduct} />
          <RelatedProducts />
        </div>
      </div>
    </main>
  );
}

export default ProductDetailPage;
