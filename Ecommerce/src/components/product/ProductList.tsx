import { useMemo } from "react";
import { useToast } from "../../hook/useToast";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoMdReturnRight } from "react-icons/io";

import { ProductType } from "../../types/ProductType";

import { useNavigate } from "react-router-dom";
import ButtonIconEdit from "../common/ButtonIconEdit";
import ButtonIconDelete from "../common/ButtonIconDelete";

interface ProductListProps {
  dataProducts: ProductType[];
  selectCatetory: number;
  setIsProduct: React.Dispatch<React.SetStateAction<number | null>>;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function ProductList({
  dataProducts,
  selectCatetory,
  setIsProduct,
  setIsOpenModal,
}: ProductListProps) {
  const { showToast } = useToast();

  const navigate = useNavigate();

  const filterProducts = useMemo(() => {
    return dataProducts.filter((product) =>
      selectCatetory ? product.category.id === selectCatetory : product,
    );
  }, [selectCatetory, dataProducts]);

  const parseImageUrls = (value: any): string[] => {
    try {
      if (typeof value !== "string") return [];
      const trimmed = value.trim();
      if (!trimmed.startsWith("[")) return [];
      return JSON.parse(trimmed);
    } catch {
      return [];
    }
  };

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark">
              <th className="py-3 px-4 font-medium">
                <input
                  className="form-checkbox rounded border-gray-400 dark:border-gray-600 bg-card-light dark:bg-card-dark text-primary focus:ring-primary/50"
                  type="checkbox"
                />
              </th>
              <th className="py-3 px-4 font-medium">Sản phẩm</th>
              <th className="py-3 px-4 font-medium">Danh mục</th>
              <th className="py-3 px-4 font-medium">Giá</th>
              <th className="py-3 px-4 font-medium">Sale</th>
              <th className="py-3 px-4 font-medium">Tồn kho</th>
              <th className="py-3 px-4 font-medium">Trạng thái</th>
              <th className="py-3 px-4 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filterProducts.map((product) => {
              const image_product = parseImageUrls(product.image_url);
              const imageSrc = image_product[0] || "/no-image.png";
              const formatMoneyString = (value: string) =>
                Number(value).toLocaleString("vi-VN");
              return (
                <tr
                  key={product.id}
                  className="border-b border-border-light dark:border-border-dark"
                >
                  <td className="py-3 px-4">
                    <input
                      className="form-checkbox rounded border-gray-400 dark:border-gray-600 bg-card-light dark:bg-card-dark text-primary focus:ring-primary/50"
                      type="checkbox"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={imageSrc}
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-10"
                      />
                      <div>
                        <p className="font-medium text-text-light dark:text-text-dark">
                          {product.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{product.category.name}</td>
                  <td className="py-3 px-4">
                    {formatMoneyString(
                      String(
                        product.sale
                          ? product.sale.discount_type === "percent"
                            ? product.price *
                              (1 - product.sale.discount_value / 100)
                            : product.price - product.sale.discount_value
                          : product.price,
                      ),
                    )}{" "}
                    đ
                  </td>
                  <td className="py-3 px-4">
                    {product.sale ? product.sale.discount_value : 0}{" "}
                    {product.sale && product.sale.discount_type === "fixed"
                      ? "đ"
                      : "%"}
                  </td>
                  <td className="py-3 px-4">{product.sumStock}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${product.status.hex ? "" : "bg-green-100 text-green-800"}`}
                      style={{
                        backgroundColor: product.status.hex
                          ? product.status.hex
                          : "",
                      }}
                    >
                      {product.status.name
                        ? product.status.name
                        : "Chưa có trạng thái"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <ButtonIconEdit
                        onClick={() => {
                          setIsOpenModal(true);
                          setIsProduct(product.id);
                        }}
                      />
                      <ButtonIconDelete />
                      <button
                        className="p-2 rounded-full hover:bg-primary/20"
                        onClick={() => {
                          navigate(`${product.id}`);
                        }}
                      >
                        <IoMdReturnRight className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-4 border-t border-border-light dark:border-border-dark">
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
          Hiển thị 1-5 trên 50 sản phẩm
        </p>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center size-8 rounded-lg hover:bg-primary/20 disabled:opacity-50">
            <FaAngleLeft size={12} className="text-xl" />
          </button>
          <button className="flex items-center justify-center size-8 rounded-lg bg-primary/20 text-sm font-bold">
            1
          </button>
          <button className="flex items-center justify-center size-8 rounded-lg hover:bg-primary/20 text-sm">
            2
          </button>
          <button className="flex items-center justify-center size-8 rounded-lg hover:bg-primary/20 text-sm">
            3
          </button>
          <span className="text-text-muted-light dark:text-text-muted-dark">
            ...
          </span>
          <button className="flex items-center justify-center size-8 rounded-lg hover:bg-primary/20 text-sm">
            10
          </button>
          <button className="flex items-center justify-center size-8 rounded-lg hover:bg-primary/20">
            <FaAngleRight size={12} className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
