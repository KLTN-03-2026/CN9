import { Modal } from "antd";
import React, { useEffect, useState } from "react";

import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineRule, MdOutlineSquareFoot } from "react-icons/md";

import {
  CreateMeasurementType,
  MeasurementType,
  UpdateMeasurementType,
} from "../../types/MeasurementType";

import {
  createMeasurement,
  getAllMeasurement,
  getMeasurementById,
  updateMeasurementById,
} from "../../api/measurementApi";

import { useToast } from "../../hook/useToast";

interface MeasurementFromProps {
  isShowMeasurement: boolean;
  setIsShowMeasurement: React.Dispatch<React.SetStateAction<boolean>>;
}

function MeasurementFrom({
  isShowMeasurement,
  setIsShowMeasurement,
}: MeasurementFromProps) {
  const { showToast } = useToast();

  const [inputMeasurement, setInputMeasurement] =
    useState<CreateMeasurementType>({
      name: "",
      unit: "",
    });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputMeasurement, string>>
  >({});

  const [idMeasurement, setIdMeasurement] = useState<number | null>(null);

  const [originalData, setOriginalData] =
    useState<CreateMeasurementType | null>(null);

  const [dataMeasurement, setDataMeasurement] = useState<MeasurementType[]>([]);

  const handleGetDataAllMeasurement = async () => {
    try {
      const resMeasurement = await getAllMeasurement();
      setDataMeasurement(resMeasurement.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isShowMeasurement) return;
    handleGetDataAllMeasurement();
  }, [isShowMeasurement]);

  function hanldeInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setInputMeasurement((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function buildUpdateData(data: CreateMeasurementType) {
    const updateData: UpdateMeasurementType = {};

    if (data.name !== originalData?.name) {
      updateData.name = data.name;
    }

    if (data.unit !== originalData?.unit) {
      updateData.unit = data.unit;
    }

    return Object.keys(updateData).length > 0 ? updateData : null;
  }

  const handleSubmitMeasurement = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputMeasurement.name) {
        newErrors.name = "Vui lòng nhập tên đo lường";
      }

      if (!inputMeasurement.unit) {
        newErrors.unit = "Vui lòng chọn đơn vị đo";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data = {
        name: inputMeasurement.name,
        unit: inputMeasurement.unit,
      };

      if (idMeasurement) {
        const updateData = buildUpdateData(data);

        if (!updateData) {
          showToast("Không có gì thay đổi", "warning");
          return;
        }
        const resMeasurement = await updateMeasurementById(
          idMeasurement,
          updateData,
        );
        setIdMeasurement(null);
      } else {
        const resMeasurement = await createMeasurement(data);
      }

      setInputMeasurement({ name: "", unit: "" });
      handleGetDataAllMeasurement();
    } catch (error) {
      console.log(error);
    }
  };

  const getDataMeasurementById = async (id: number) => {
    try {
      const resMeasurement = await getMeasurementById(id);
      const data = {
        name: resMeasurement.data.name,
        unit: resMeasurement.data.unit,
      };

      setInputMeasurement(data);
      setOriginalData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!idMeasurement) return;

    getDataMeasurementById(idMeasurement);
  }, [idMeasurement]);

  return (
    <Modal
      open={isShowMeasurement}
      onCancel={() => setIsShowMeasurement(false)}
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setIsShowMeasurement(false)}
              className="w-full sm:w-auto px-8 py-3 rounded-lg text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              type="button"
            >
              Hủy
            </button>
            <button
              className="w-full sm:w-auto px-10 py-3 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
              type="submit"
              onClick={() => handleSubmitMeasurement()}
            >
              {idMeasurement ? "Cập nhật " : "Lưu "}đo lường
            </button>
          </div>
        </div>
      }
    >
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold">
            Tên đo lường
          </label>
          <input
            name="name"
            value={inputMeasurement.name}
            onChange={hanldeInputChange}
            className="w-full pl-4 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white"
            placeholder="Ví dụ: Vòng ngực, Cân nặng, Chiều cao..."
            type="text"
          />
          <p className="text-red-500 font-medium">{errors.name}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold">
              Đơn vị đo
            </label>
            <div className="relative">
              <MdOutlineSquareFoot
                size={25}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                name="unit"
                value={inputMeasurement.unit}
                onChange={hanldeInputChange}
                className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all text-slate-900 dark:text-white"
              >
                <option value="">Chọn đơn vị</option>
                <option value="cm">Centimeter (cm)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="inch">Inch (in)</option>
                <option value="mm">Millimeter (mm)</option>
              </select>
              <IoIosArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <p className="text-red-500 font-medium">{errors.unit}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-slate-700 dark:text-slate-300">
            <MdOutlineRule className="text-[20px]" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Danh sách thông số đo lường
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {dataMeasurement.map((measurement) => {
              return (
                <span
                  onClick={() => setIdMeasurement(measurement.id)}
                  key={measurement.id}
                  className="hover:opacity-75 cursor-pointer px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium"
                >
                  {measurement.name} ({measurement.unit})
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default MeasurementFrom;
