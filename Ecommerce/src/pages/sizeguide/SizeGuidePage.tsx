import { IoIosAddCircleOutline } from "react-icons/io";

import { useEffect, useState } from "react";

import MeasurementFrom from "../../components/size_guide/MeasurementForm";
import SizeGuideForm from "../../components/size_guide/SizeGuideForm";

import HeaderPage from "../../components/common/Header";

import { CategoryType } from "../../types/CategoryType";
import { getAllCategory } from "../../api/categoryApi";
import { getSizeGuideByCategory } from "../../api/sizeApi";
import { SizeGuideResponseType } from "../../types/sizeGuideType";

function SizeGuidePage() {
  const [isShowMeasurement, setIsShowMeasurement] = useState(false);

  const [isShowSizeGuide, setIsShowSizeGuide] = useState(false);

  const [idSizeMeasurement, setIdSizeMeasurement] = useState<number | null>(
    null,
  );

  const [dataCategories, setDataCategories] = useState<CategoryType[]>([]);

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const [dataSizeGuide, setDataSizeGuide] = useState<SizeGuideResponseType>({
    sizes: [],
    data: [],
  });

  const handlegetDataAllCategories = async () => {
    try {
      const resCategory = await getAllCategory();
      const categories = resCategory.data;

      setDataCategories(categories);

      if (categories.length > 0) {
        setActiveCategoryId(categories[0].id);
        handleGetAllSizeGuideByCategory(categories[0].id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllSizeGuideByCategory = async (categoryId: number) => {
    try {
      const resSizeGuide = await getSizeGuideByCategory(categoryId);

      setDataSizeGuide(resSizeGuide.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handlegetDataAllCategories();
  }, []);

  return (
    <>
      <HeaderPage
        title="Quản lý Hướng dẫn chọn Size"
        content="Xem và quản lý các thông số kích thước sản phẩm theo từng thể loại."
        component={
          <>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsShowMeasurement(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-background-dark hover:opacity-90"
              >
                <IoIosAddCircleOutline className="text-lg" />
                <span>Thêm đo lường</span>
              </button>
            </div>
          </>
        }
      />
      <div className="mb-8 overflow-x-auto">
        <div className="flex border-b border-slate-200 dark:border-slate-800 min-w-max">
          {dataCategories.map((category, index) => {
            const isActive = category.id === activeCategoryId;

            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategoryId(category.id);
                  handleGetAllSizeGuideByCategory(category.id);
                }}
                className={`px-6 py-4 border-b-2 text-sm flex items-center gap-2 transition-all
        ${
          isActive
            ? "border-primary text-primary font-bold"
            : "border-transparent text-slate-500 font-semibold hover:text-slate-700 dark:hover:text-slate-300"
        }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6 bg-white dark:bg-background-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-lg">Ma trận kích thước chuẩn (cm)</h3>
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase">
            Cập nhật: 20/05/2024
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  Loại đo lường
                </th>
                {dataSizeGuide.sizes.map((size) => {
                  return (
                    <th
                      key={size}
                      className="px-6 py-4 text-sm font-bold text-center text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800"
                    >
                      Size {size}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {dataSizeGuide.data.map((row) => (
                <tr>
                  <td className="px-6 py-5 font-bold text-slate-700 dark:text-slate-300">
                    {row.measurementType}
                  </td>

                  {dataSizeGuide.sizes.map((size) => (
                    <td
                      onDoubleClick={() => {
                        setIdSizeMeasurement(row.id);
                        console.log(size);
                        setIsShowSizeGuide(true);
                      }}
                      key={size}
                      className="px-6 py-5 text-center text-slate-700 dark:text-slate-300"
                    >
                      {row[size] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 italic">
          * Lưu ý: Các thông số trên mang tính chất tham khảo, có thể thay đổi
          tùy theo form dáng cụ thể của từng sản phẩm.
        </div>
      </div>
      <div className="mt-10 flex items-center gap-4 justify-end">
        <button
          onClick={() => setIsShowSizeGuide(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-background-dark hover:opacity-90"
        >
          <IoIosAddCircleOutline className="text-lg" />
          <span>Thêm thông số</span>
        </button>
      </div>
      <MeasurementFrom
        isShowMeasurement={isShowMeasurement}
        setIsShowMeasurement={setIsShowMeasurement}
      />
      <SizeGuideForm
        idSizeMeasurement={idSizeMeasurement}
        isShowSizeGuide={isShowSizeGuide}
        setIsShowSizeGuide={setIsShowSizeGuide}
        handleGetAllSizeGuideByCategory={handleGetAllSizeGuideByCategory}
      />
    </>
  );
}

export default SizeGuidePage;
