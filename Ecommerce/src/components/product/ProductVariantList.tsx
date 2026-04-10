import { useEffect, useState } from "react";

import { ProductVariantType } from "../../types/ProductType";
import { useToast } from "../../hook/useToast";
import { getAllProductVariants } from "../../api/productApi";
import ButtonIconEdit from "../common/ButtonIconEdit";
import ButtonIconDelete from "../common/ButtonIconDelete";

interface ProductVariantListProps {
  idVar: number;
}

function ProductVariantList({ idVar }: ProductVariantListProps) {
  const { showToast } = useToast();

  const [dataProductVariants, setDataProductVariants] = useState<
    ProductVariantType[]
  >([]);

  const getDataVariants = async () => {
    try {
      const resVariants = await getAllProductVariants(idVar);
      setDataProductVariants(resVariants.data);
      console.log(resVariants);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    if (!idVar) return;

    getDataVariants();
  }, []);
  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
      <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-start items-center">
        <h2 className="text-lg font-semibold">Danh sách biến thể (3)</h2>
      </div>
      <div className="grid grid-cols-12 gap-4 p-4 bg-background-light/50 dark:bg-background-dark/50 text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider border-b border-border-light dark:border-border-dark">
        <div className="col-span-5">Biến thể</div>
        <div className="col-span-3 text-center">Tồn kho</div>
        <div className="col-span-3 text-right">Hành động</div>
      </div>
      {dataProductVariants.map((variant) => {
        return (
          <div className="group grid grid-cols-12 gap-4 p-4 items-center border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark/30 transition-colors">
            <div className="col-span-5 flex items-center gap-3">
              <div className="relative size-12 flex-shrink-0">
                <img
                  src={variant.image_url}
                  className="bg-center bg-no-repeat w-full h-full bg-cover rounded-lg border border-border-light dark:border-border-dark"
                  alt=""
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    style={{ backgroundColor: variant.hex_color }}
                    className="size-3 rounded-full ring-1 ring-offset-1 ring-border-light dark:ring-border-dark"
                  />
                  <p className="font-medium text-text-light dark:text-text-dark">
                    {variant.name_color}
                  </p>
                </div>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
                  Size: {variant.symbol_size}
                </p>
              </div>
            </div>
            <div className="col-span-3 text-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {variant.stock}
              </span>
            </div>
            <div className="col-span-3 flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
              <ButtonIconEdit />
              <ButtonIconDelete />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductVariantList;
