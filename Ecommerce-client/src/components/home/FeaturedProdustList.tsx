import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { FeaturedProducts } from "../../api/productApi";

import { formatMoneyString } from "../../utils/formatPrice";

import { MdAddShoppingCart } from "react-icons/md";

import { addItem } from "../../redux/cart/cartSlice";

import { addProductToCart } from "../../api/cartApi";
import type { ProductType } from "../../type/ProductType";

function FeaturedProdustList() {
  const navigate = useNavigate();
  const [dataFeaturedProducts, setDataFeaturedProducts] = useState<
    ProductType[]
  >([]);

  const handleGetDataFeaturedProducts = async () => {
    try {
      const resPro = await FeaturedProducts();
      setDataFeaturedProducts(resPro.data);
    } catch (error) {
      console.log(error);
    }
  };

  const dispatch = useDispatch();

  const [selectedSize, setSelectedSize] = useState<
    Record<number, number | null>
  >({});

  const [selectedColor, setSelectedColor] = useState<
    Record<number, number | null>
  >({});

  useEffect(() => {
    handleGetDataFeaturedProducts();
  }, []);

  const handleAddToCart = async (product: ProductType) => {
    try {
      const currentColor = selectedColor[product.id];
      const currentSize = selectedSize[product.id];

      const variant = product.variants.find(
        (v) => v.color.id === currentColor && v.size.id === currentSize,
      );

      if (!variant) {
        return;
      }

      dispatch(
        addItem({
          color: variant.color.name_color,
          image_url: variant.image_url,
          name: product.name,
          price:
            product.sale && product.price
              ? product.sale.discount_type === "fixed"
                ? product.price - product.sale.discount_value
                : product.price -
                  product.price * (product.sale.discount_value / 100)
              : product.price,
          productId: product.id,
          quantity: 1,
          size: variant.size.Symbol,
          variantId: variant.id,
          isChecked: false,
          sale: product.sale,
        }),
      );

      await addProductToCart(variant.id, 1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="px-6 md:px-12 py-10">
      <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <h2 className="text-3xl font-light tracking-tight text-primary uppercase">
            Sản phẩm bán chạy
          </h2>
          <div className="mt-4 w-12 h-0.5 bg-primary" />
        </div>
      </div>
      <input className="hidden" id="load-more-trigger" type="checkbox" />
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {dataFeaturedProducts.map((feaPro, i) => {
          const currentColor = selectedColor[feaPro.id] ?? null;
          const currentSize = selectedSize[feaPro.id] ?? null;

          const variantMap = feaPro.variantMap;

          const imageSrc = currentColor
            ? variantMap?.colorImageMap?.[currentColor] || feaPro.image_url
            : feaPro.image_url;

          const validSizes = currentColor
            ? variantMap?.colorToSizes?.[currentColor] || []
            : [];

          const validColors = currentSize
            ? variantMap?.sizeToColors?.[currentSize] || []
            : [];

          const isNewProduct = (createdAt: string | Date, days = 7) => {
            const created = new Date(createdAt);
            if (isNaN(created.getTime())) return false;

            return Date.now() - created.getTime() <= days * 24 * 60 * 60 * 1000;
          };

          return (
            <div
              key={feaPro.id}
              className="product-card group bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="relative overflow-hidden aspect-[3/4]">
                {isNewProduct(feaPro.createdAt) ? (
                  <span className="tag-new">NEW</span>
                ) : (
                  <></>
                )}
                {feaPro.sale ? (
                  <span className="tag-sale">
                    -
                    {feaPro.sale.discount_type === "fixed"
                      ? formatMoneyString(String(feaPro.sale.discount_value)) +
                        "đ"
                      : feaPro.sale.discount_value + "%"}
                  </span>
                ) : (
                  <></>
                )}
                <img
                  onClick={() => navigate("/detail/" + feaPro.slug)}
                  className="cursor-pointer w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  data-alt={feaPro.name}
                  src={imageSrc}
                />
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex gap-2">
                    {feaPro.colors?.map((color) => {
                      const isValid =
                        !currentSize || validColors.includes(color.id);

                      return (
                        <button
                          key={color.id}
                          disabled={!isValid}
                          onClick={() =>
                            setSelectedColor((prev) => ({
                              ...prev,
                              [feaPro.id]:
                                prev[feaPro.id] === color.id ? null : color.id,
                            }))
                          }
                          className={`w-8 h-8 rounded-full border        ${
                            !isValid
                              ? "opacity-30 cursor-not-allowed"
                              : "hover:ring-2 hover:ring-primary"
                          }        ${selectedColor[feaPro.id] === color.id ? "ring-2 ring-primary" : ""}`}
                          style={{ backgroundColor: color.hex }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    {feaPro.sizes?.map((size) => {
                      const isValid =
                        !currentColor || validSizes.includes(size.id);

                      return (
                        <button
                          key={size.id}
                          disabled={!isValid}
                          onClick={() =>
                            isValid &&
                            setSelectedSize((prev) => ({
                              ...prev,
                              [feaPro.id]:
                                prev[feaPro.id] === size.id ? null : size.id,
                            }))
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-semibold        ${
                            isValid
                              ? "bg-primary/20 hover:bg-primary/30 cursor-pointer"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                          }        ${
                            selectedSize[feaPro.id] === size.id
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
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {feaPro.category.name}
                </h3>
                <h2 className="text-base font-bold mb-3 truncate">
                  {feaPro.name}
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {feaPro.sale ? (
                      <span className="text-xs text-slate-400 line-through">
                        {formatMoneyString(String(feaPro.price))}đ
                      </span>
                    ) : (
                      <></>
                    )}
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {formatMoneyString(
                        String(
                          feaPro.sale
                            ? feaPro.sale.discount_type === "fixed"
                              ? feaPro.price - feaPro.sale.discount_value
                              : feaPro.price -
                                feaPro.price *
                                  (feaPro.sale.discount_value / 100)
                            : feaPro.price,
                        ),
                      )}
                      đ
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleAddToCart(feaPro);
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-primary text-background-dark rounded-full hover:shadow-lg hover:shadow-primary/40 transition-all"
                  >
                    <MdAddShoppingCart className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Link to={"/collections"}>
        <div className="load-more-container mt-20 flex justify-center">
          <label
            className="px-20 py-5 border border-primary text-[11px] font-bold uppercase tracking-[0.3em] cursor-pointer hover:bg-primary hover:text-white transition-all duration-300"
            htmlFor="load-more-trigger"
          >
            Xem thêm sản phẩm
          </label>
        </div>
      </Link>
    </section>
  );
}

export default FeaturedProdustList;
