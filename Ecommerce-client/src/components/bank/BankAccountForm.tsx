import { Modal } from "antd";

import axios from "axios";
import React, { useEffect, useState } from "react";

import { IoMdClose } from "react-icons/io";
import { MdExpandMore, MdOutlineAccountBalance } from "react-icons/md";
import { createBankAccount } from "../../api/bankAccountApi";
import type { CreateBankAccountType } from "../../type/BankAccountType";

interface BankAccountFormProps {
  isShowBankForm: boolean;
  setIsShowBankForm: React.Dispatch<React.SetStateAction<boolean>>;
}

function BankAccountForm({
  isShowBankForm,
  setIsShowBankForm,
}: BankAccountFormProps) {
  const [dataBank, setDataBank] = useState<
    { id: number; code: string; short_name: string }[]
  >([]);

  const [inputBankAccount, setInputBankAccount] =
    useState<CreateBankAccountType>({
      accountName: "",
      accountNo: "",
      bankCode: "",
      bankName: "",
    });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputBankAccount, string>>
  >({});

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setInputBankAccount((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const handleSelectBank = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;

    const bank = dataBank.find((b) => b.code === code);

    setInputBankAccount({
      ...inputBankAccount,
      bankCode: bank?.code || "",
      bankName: bank?.short_name || "",
    });
  };

  const handleGetAllBanks = async () => {
    try {
      const resBanks = await axios.get("https://api.vietqr.io/v2/banks");
      setDataBank(resBanks.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllBanks();
  }, []);

  const handleSubmitBankAccount = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputBankAccount.accountName) {
        newErrors.accountName = "Vui lòng nhập tên tài khoản";
      }

      if (!inputBankAccount.bankCode) {
        newErrors.bankCode = "Vui lòng chọn ngân hàng";
      }

      if (!inputBankAccount.accountNo) {
        newErrors.accountNo = "Vui lòng nhập số tài khoản";
      }

      if (!inputBankAccount.bankName) {
        newErrors.bankName = "Vui lòng chọn ngân hàng";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const resBankAccount = await createBankAccount({
        accountName: inputBankAccount.accountName,
        accountNo: inputBankAccount.accountNo,
        bankCode: inputBankAccount.bankCode,
        bankName: inputBankAccount.bankName,
      });

      console.log(resBankAccount);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={isShowBankForm}
      onCancel={() => setIsShowBankForm(false)}
      closable={false}
      footer={
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setIsShowBankForm(false)}
            className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-full font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            type="button"
          >
            Hủy
          </button>
          <button
            onClick={() => handleSubmitBankAccount()}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            type="submit"
          >
            Thêm tài khoản
          </button>
        </div>
      }
    >
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[24px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold dark:text-white">
            Thêm tài khoản ngân hàng mới
          </h2>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <IoMdClose />
          </button>
        </div>
        <form className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Chọn ngân hàng
            </label>
            <div className="relative">
              <select
                onChange={handleSelectBank}
                value={inputBankAccount.bankCode}
                name="bankCode"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              >
                <option value="">Chọn ngân hàng từ danh sách</option>
                {dataBank.map((bank) => (
                  <option key={bank.id} value={bank.code}>
                    {bank.short_name}
                  </option>
                ))}
              </select>
              <p className="text-red-500 font-medium">
                {errors.bankCode || errors.bankName}
              </p>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded bg-white flex items-center justify-center border border-slate-100 overflow-hidden">
                <MdOutlineAccountBalance className="text-slate-400 text-sm" />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <MdExpandMore className="text-slate-400" size={25} />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Số tài khoản
            </label>
            <input
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400"
              placeholder="Nhập số tài khoản của bạn"
              type="text"
              value={inputBankAccount.accountNo}
              name="accountNo"
              onChange={handleInputChange}
            />
            <p className="text-red-500 font-medium">{errors.accountNo}</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tên chủ tài khoản
            </label>
            <input
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400 uppercase"
              placeholder="VD: NGUYEN VAN A (Chữ in hoa không dấu)"
              type="text"
              value={inputBankAccount.accountName}
              name="accountName"
              onChange={handleInputChange}
            />
            <p className="text-red-500 font-medium">{errors.accountName}</p>
            <p className="text-[11px] text-slate-500 italic">
              Vui lòng nhập tên chính xác như trên thẻ ngân hàng.
            </p>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default BankAccountForm;
