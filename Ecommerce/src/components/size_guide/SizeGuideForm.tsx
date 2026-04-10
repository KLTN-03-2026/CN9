import { Modal } from "antd";

import {
  MdAspectRatio,
  MdOutlineCategory,
  MdOutlineSquareFoot,
} from "react-icons/md";

import { MeasurementType } from "../../types/MeasurementType";
import { CategoryType } from "../../types/CategoryType";
import { SizeType } from "../../types/SizeType";

import React, { useEffect, useState } from "react";

import { getAllMeasurement } from "../../api/measurementApi";
import { getAllCategory } from "../../api/categoryApi";
import {
  createSizeGuide,
  getAllSizes,
  getSizeGuideByIdSizeMeasurement,
} from "../../api/sizeApi";

interface SizeGuideFormProps {
  idSizeMeasurement: number | null;
  isShowSizeGuide: boolean;
  setIsShowSizeGuide: React.Dispatch<React.SetStateAction<boolean>>;
  handleGetAllSizeGuideByCategory: (id: number) => void;
}

function SizeGuideForm({
  isShowSizeGuide,
  idSizeMeasurement,
  setIsShowSizeGuide,
  handleGetAllSizeGuideByCategory,
}: SizeGuideFormProps) {
  const [inputSizeGuide, setInputSizeGuide] = useState<{
    categoryId: number;
    sizeId: number;
    measurementId: number;
    min: number;
    max: number;
  }>({ categoryId: 0, max: 0, measurementId: 0, min: 0, sizeId: 0 });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputSizeGuide, string>>
  >({});

  const [idSizeGuide, setIdSizeGuide] = useState<number | null>(null);

  const [dataMeasurement, setDataMeasurement] = useState<MeasurementType[]>([]);

  const [dataCategory, setDataCategory] = useState<CategoryType[]>([]);

  const [dataSize, setDataSize] = useState<SizeType[]>([]);

  const handleGetDataAllMeasurement = async () => {
    try {
      const [resMeasurement, resCategory, resSize] = await Promise.all([
        getAllMeasurement(),
        getAllCategory(),
        getAllSizes(),
      ]);
      setDataMeasurement(resMeasurement.data);
      setDataCategory(resCategory.data);
      setDataSize(resSize.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetDataSizeGuideById = async (id: number) => {
    try {
      const resSizeGuide = await getSizeGuideByIdSizeMeasurement(id);

      const data = {
        categoryId: resSizeGuide.data.categoryId,
        max: resSizeGuide.data.max,
        measurementId: resSizeGuide.data.measurementId,
        min: resSizeGuide.data.min,
        sizeId: resSizeGuide.data.sizeId,
      };

      setInputSizeGuide(data);
      setIdSizeGuide(resSizeGuide.data.sizeGuideId);
      // setDataSizeGuide(resSizeGuide.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!idSizeMeasurement) return;

    handleGetDataSizeGuideById(idSizeMeasurement);
  }, [idSizeMeasurement]);

  useEffect(() => {
    if (!isShowSizeGuide) return;

    handleGetDataAllMeasurement();
  }, [isShowSizeGuide]);

  function hanldeInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setInputSizeGuide((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value),
    }));
  }

  const handleSubmitSizeGuide = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputSizeGuide.categoryId) {
        newErrors.categoryId = "Vui lòng chọn thể loại";
      }

      if (!inputSizeGuide.sizeId) {
        newErrors.sizeId = "Vui lòng chọn kích cỡ";
      }

      if (!inputSizeGuide.measurementId) {
        newErrors.measurementId = "Vui lòng chọn đo lường";
      }

      if (!inputSizeGuide.min) {
        newErrors.min = "Vui lòng nhập giá trị tối thiểu";
      }

      if (!inputSizeGuide.max) {
        newErrors.max = "Vui lòng nhập giá trị tối đa";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const resSizeGuide = await createSizeGuide({
        categoryId: inputSizeGuide.categoryId,
        max: inputSizeGuide.max,
        measurementId: inputSizeGuide.measurementId,
        min: inputSizeGuide.min,
        sizeId: inputSizeGuide.sizeId,
      });

      handleGetAllSizeGuideByCategory(inputSizeGuide.categoryId);
      setInputSizeGuide({
        categoryId: 0,
        max: 0,
        measurementId: 0,
        min: 0,
        sizeId: 0,
      });
      setIsShowSizeGuide(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      width={"1000px"}
      open={isShowSizeGuide}
      onCancel={() => setIsShowSizeGuide(false)}
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setIsShowSizeGuide(false)}
              className="w-full sm:w-auto px-8 py-3 rounded-lg text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              type="button"
            >
              Hủy
            </button>
            <button
              className="w-full sm:w-auto px-10 py-3 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
              type="submit"
              onClick={() => handleSubmitSizeGuide()}
            >
              {idSizeMeasurement ? "Cập nhật " : "Lưu "} thông số
            </button>
          </div>
        </div>
      }
    >
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
        <form action="#" className="space-y-8" method="POST">
          {/* Top Selection Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold flex items-center gap-2">
                <MdOutlineCategory className="text-sm text-primary" />
                Category
              </label>
              <select
                value={inputSizeGuide.categoryId}
                name="categoryId"
                onChange={hanldeInputChange}
                className="form-select block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-12"
              >
                <option value={0}>Chọn thể loại</option>
                {dataCategory.map((category, i) => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
              <p className="text-red-500 font-medium">{errors.categoryId}</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold flex items-center gap-2">
                <MdAspectRatio className="text-sm text-primary" />
                Size
              </label>
              <select
                value={inputSizeGuide.sizeId}
                name="sizeId"
                onChange={hanldeInputChange}
                className="form-select block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-12"
              >
                <option value={0}>Chọn kích cỡ</option>
                {dataSize.map((size, i) => {
                  return (
                    <option key={size.id} value={size.id}>
                      Size {size.symbol}
                    </option>
                  );
                })}
              </select>
              <p className="text-red-500 font-medium">{errors.sizeId}</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold flex items-center gap-2">
                <MdOutlineSquareFoot className="text-sm text-primary" />
                Measurement Type
              </label>
              <select
                value={inputSizeGuide.measurementId}
                name="measurementId"
                onChange={hanldeInputChange}
                className="form-select block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-12"
              >
                <option value={0}>Chọn đo lường</option>
                {dataMeasurement.map((measurement, i) => {
                  return (
                    <option key={measurement.id} value={measurement.id}>
                      {measurement.name} ({measurement.unit})
                    </option>
                  );
                })}
              </select>
              <p className="text-red-500 font-medium">{errors.measurementId}</p>
            </div>
          </div>
          {/* Range Inputs Section */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4">
              Xác định phạm vi giá trị
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold">
                  Giá trị tối thiểu
                </label>
                <div className="relative">
                  <input
                    value={inputSizeGuide.min}
                    name="min"
                    onChange={hanldeInputChange}
                    className="form-input block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-12 pl-4 pr-12"
                    placeholder={"0.0"}
                    type="number"
                  />
                  <p className="text-red-500 font-medium">{errors.min}</p>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-slate-400 text-sm font-medium">
                      cm / kg
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold">
                  Giá trị tối đa
                </label>
                <div className="relative">
                  <input
                    value={inputSizeGuide.max}
                    name="max"
                    onChange={hanldeInputChange}
                    className="form-input block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary h-12 pl-4 pr-12"
                    placeholder={"0.0"}
                    type="number"
                  />
                  <p className="text-red-500 font-medium">{errors.max}</p>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-slate-400 text-sm font-medium">
                      cm / kg
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default SizeGuideForm;
