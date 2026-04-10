import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState } from "react";
import { FeaturedProducts, getSaleProducts } from "../../api/productApi";
import { MdAddShoppingCart } from "react-icons/md";
import { formatMoneyString } from "../../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import { getProductBySlugCategory } from "../../api/categoryApi";
import { useDispatch } from "react-redux";
import { addItem } from "../../redux/cart/cartSlice";
import { addProductToCart } from "../../api/cartApi";
import type { ProductType } from "../../type/ProductType";

interface CollectionsListProps {
  collectionKey?: string;
}

function CollectionsList({ collectionKey }: CollectionsListProps) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [dataProducts, setDataProducts] = useState<ProductType[]>([]);

  const [selectedSize, setSelectedSize] = useState<
    Record<number, number | null>
  >({});

  const [selectedColor, setSelectedColor] = useState<
    Record<number, number | null>
  >({});

  const handleGetDataFeaturedProducts = async () => {
    try {
      const resPro = await FeaturedProducts();
      setDataProducts(resPro.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataProductBySlugCategory = async (slug: string) => {
    try {
      const resProducts = await getProductBySlugCategory(slug);
      setDataProducts(resProducts.data);
      console.log(resProducts);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataSaleProducts = async () => {
    try {
      const resProducts = await getSaleProducts();
      setDataProducts(resProducts.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!collectionKey) {
      handleGetDataFeaturedProducts();
      return;
    }

    if (collectionKey === "sale") {
      getDataSaleProducts();
      return;
    }

    getDataProductBySlugCategory(collectionKey);
  }, [collectionKey]);

  const handleAddToCart = async (product: ProductType) => {
    console.log(product.variants);

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
  };

  const isNewProduct = (createdAt: string | Date, days = 7) => {
    const created = new Date(createdAt);
    if (isNaN(created.getTime())) return false;

    return Date.now() - created.getTime() <= days * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Tất cả sản phẩm
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Hiển thị 12 trên 145 sản phẩm
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
            Sắp xếp:
          </span>
          <div className="relative group">
            <select className="appearance-none bg-white border border-slate-100 py-2.5 pl-4 pr-10 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary cursor-pointer w-48 transition-all">
              <option>Mới nhất</option>
              <option>Giá tăng dần</option>
              <option>Giá giảm dần</option>
              <option>Bán chạy nhất</option>
            </select>
            <IoIosArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-lg" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-10">
        {dataProducts.map((product) => {
          const currentColor = selectedColor[product.id] ?? null;
          const currentSize = selectedSize[product.id] ?? null;

          const variantMap = product.variantMap;

          const imageSrc = currentColor
            ? variantMap?.colorImageMap?.[currentColor] || product.image_url
            : product.image_url;

          const validSizes = currentColor
            ? variantMap?.colorToSizes?.[currentColor] || []
            : [];

          const validColors = currentSize
            ? variantMap?.sizeToColors?.[currentSize] || []
            : [];
          return (
            <div
              key={product.id}
              className="product-card group bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="relative overflow-hidden aspect-[3/4]">
                {isNewProduct(product.createdAt) ? (
                  <span className="tag-new">NEW</span>
                ) : (
                  <></>
                )}
                {product.sale ? (
                  <span className="tag-sale">
                    -
                    {product.sale.discount_type === "fixed"
                      ? formatMoneyString(String(product.sale.discount_value)) +
                        "đ"
                      : product.sale.discount_value + "%"}
                  </span>
                ) : (
                  <></>
                )}
                <img
                  onClick={() => navigate("/detail/" + product.slug)}
                  className="cursor-pointer w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  data-alt={product.name}
                  src={imageSrc}
                />
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex gap-2">
                    {product.colors?.map((color) => {
                      const isValid =
                        !currentSize || validColors.includes(color.id);

                      return (
                        <button
                          key={color.id}
                          disabled={!isValid}
                          onClick={() =>
                            setSelectedColor((prev) => ({
                              ...prev,
                              [product.id]:
                                prev[product.id] === color.id ? null : color.id,
                            }))
                          }
                          className={`w-8 h-8 rounded-full border        ${
                            !isValid
                              ? "opacity-30 cursor-not-allowed"
                              : "hover:ring-2 hover:ring-primary"
                          }        ${selectedColor[product.id] === color.id ? "ring-2 ring-primary" : ""}`}
                          style={{ backgroundColor: color.hex }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    {product.sizes?.map((size) => {
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
                              [product.id]:
                                prev[product.id] === size.id ? null : size.id,
                            }))
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-semibold  ${
                            isValid
                              ? "bg-primary/20 hover:bg-primary/30 cursor-pointer"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                          }        ${
                            selectedSize[product.id] === size.id
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
                  {product.category.name}
                </h3>
                <h2 className="text-base font-bold mb-3 truncate">
                  {product.name}
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {product.sale ? (
                      <span className="text-xs text-slate-400 line-through">
                        {formatMoneyString(String(product.price))}đ
                      </span>
                    ) : (
                      <></>
                    )}
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {formatMoneyString(
                        String(
                          product.sale
                            ? product.sale.discount_type === "fixed"
                              ? product.price - product.sale.discount_value
                              : product.price -
                                product.price *
                                  (product.sale.discount_value / 100)
                            : product.price,
                        ),
                      )}
                      đ
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
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
      <div className="mt-20 flex flex-col items-center gap-8">
        <div className="flex items-center gap-1.5">
          <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 hover:bg-slate-50 transition-colors">
            <span className="material-icons text-sm">chevron_left</span>
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary text-white text-xs font-bold">
            1
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors">
            2
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors">
            3
          </button>
          <span className="px-2 text-slate-300">...</span>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors">
            12
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-100 text-slate-400 hover:bg-slate-50 transition-colors">
            <span className="material-icons text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollectionsList;
