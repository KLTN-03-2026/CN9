import { FaRegCircleCheck } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";

import Button from "../../common/Button";

import PointForm from "./PointForm";

import { PointRuleType } from "../../../types/PointRuleType";

import { useEffect, useState } from "react";
import { useToast } from "../../../hook/useToast";

import {
  getAllPointRules,
  toggleActivePointRule,
} from "../../../api/pointRuleApi";

function PointMange() {
  const { showToast } = useToast();

  const [isShowModalPoint, setIsShowModalPoint] = useState(false);

  const [dataPointRules, setDataPointRules] = useState<PointRuleType[]>([]);

  const getDataALlPointRules = async () => {
    try {
      const resPointRules = await getAllPointRules();
      setDataPointRules(resPointRules.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDataALlPointRules();
  }, []);

  const handleActiveChangePointRule = async (id: number) => {
    try {
      const resActive = await toggleActivePointRule(id);
      getDataALlPointRules();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };
  return (
    <section
      className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark"
      id="point-settings"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Cài đặt điểm thưởng</h2>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
            Quản lý các các phương thức đổi điểm thưởng.
          </p>
        </div>
        <Button
          title="Thêm điểm thưởng"
          icon={<IoMdAdd className="text-xl" />}
          onClick={() => setIsShowModalPoint(true)}
        />
      </div>
      <div className="flex flex-col gap-4 mt-6">
        {dataPointRules.map((pointRule) => {
          const formatMoneyString = (value: string) =>
            Number(value).toLocaleString("vi-VN");
          return (
            <div
              key={pointRule.id}
              className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg"
            >
              <div className="flex items-center gap-4">
                <FaRegCircleCheck
                  className={`w-10 h-10 p-2 text-xl ${pointRule.is_active ? "text-primary bg-emerald-100" : "text-gray-400 bg-gray-100"}  rounded-full `}
                />
                <div className="flex items-center">
                  <p className="font-medium mr-20 text-xl">
                    {pointRule.point} điểm
                  </p>
                  <p className="text-sm text-gray-600">
                    Giảm {formatMoneyString(String(pointRule.discount_value))}
                    {pointRule.discount_type === "fixed" ? "đ" : "%"} cho đơn
                    hàng
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  className="sr-only peer"
                  type="checkbox"
                  value=""
                  onClick={() => handleActiveChangePointRule(pointRule.id)}
                  checked={pointRule.is_active}
                />
                <div className="w-11 h-6 bg-border-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-border-dark peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          );
        })}
      </div>
      <PointForm
        isShowModalPoint={isShowModalPoint}
        setIsShowModalPoint={setIsShowModalPoint}
      />
    </section>
  );
}

export default PointMange;
