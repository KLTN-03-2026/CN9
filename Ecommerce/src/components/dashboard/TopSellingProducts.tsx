import { useEffect, useMemo, useState } from "react";

import { getTopSellingCategories } from "../../api/categoryApi";

function TopSellingProducts() {
  const [dataTopCategories, setDataTopCategories] = useState<
    { id: number; name: string; totalSold: number; totalProducts: number }[]
  >([]);

  const totalSolds = useMemo(
    () => dataTopCategories.reduce((sum, c) => sum + c.totalSold, 0),
    [dataTopCategories],
  );

  const totalProductSold = useMemo(() => {
    return dataTopCategories.reduce((sum, v) => sum + v.totalProducts, 0);
  }, [dataTopCategories]);

  const handleGetTopSellingCategory = async () => {
    try {
      const resTopCategories = await getTopSellingCategories();

      setDataTopCategories(resTopCategories.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetTopSellingCategory();
  }, []);
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark">
      <p className="text-base font-medium">Danh mục bán chạy</p>
      <p className="text-3xl font-bold truncate">
        {totalProductSold} sản phẩm đã bán
      </p>
      <div className="flex gap-1">
        <p className="text-text-muted-light dark:text-text-muted-dark text-sm">
          Tháng này
        </p>
        <p className="text-success text-sm font-medium">+8.2%</p>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2 pt-4">
        {dataTopCategories.map((category) => {
          return (
            <div key={category.id} className="w-full flex items-center">
              <span className="w-24 text-sm text-text-muted-light dark:text-text-muted-dark">
                {category.name}
              </span>
              <div className="flex-1 bg-primary/20 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{
                    width: (category.totalSold / totalSolds) * 100 + "%",
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TopSellingProducts;
