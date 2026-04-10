import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDeleteOutline, MdInfoOutline, MdModeEdit } from "react-icons/md";
import BankAccountForm from "../../components/bank/BankAccountForm";
import { useEffect, useState } from "react";
import {
  getAllUserBankAccount,
  togglePrimaryUserbankAccount,
} from "../../api/bankAccountApi";
import type { BankAccountType } from "../../type/BankAccountType";

function BankAccountpage() {
  const [isShowBankForm, setIsShowBankForm] = useState(false);

  const [dataBankAccount, setDataBankAccount] = useState<BankAccountType[]>([]);

  const handleGetAllBankAccount = async () => {
    try {
      const resBank = await getAllUserBankAccount();
      setDataBankAccount(resBank.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTogglePrimaryBank = async (id: number) => {
    try {
      const resPrimary = await togglePrimaryUserbankAccount(id);
      handleGetAllBankAccount();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllBankAccount();
  }, []);
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            Tài khoản ngân hàng
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Quản lý các tài khoản ngân hàng liên kết của bạn.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <>
          {dataBankAccount.map((bankAccount) => (
            <div
              key={bankAccount.id}
              className="bg-emerald-50/30 dark:bg-emerald-900/10 border-2 border-primary rounded-2xl p-6 relative group transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-lg">{bankAccount.bankName}</h4>
                </div>

                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                    <MdModeEdit className="text-[20px]" />
                  </button>

                  <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500">
                    <MdDeleteOutline className="text-[20px]" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Tên chủ tài khoản
                  </span>
                  <span className="font-semibold">
                    {bankAccount.accountName}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Số tài khoản
                  </span>
                  <span className="font-mono text-lg font-bold tracking-[0.2em]">
                    {bankAccount.accountNo}
                  </span>
                </div>
              </div>

              {bankAccount.is_primary ? (
                <div className="mt-6 flex items-center justify-between">
                  <span className="bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Mặc định
                  </span>
                </div>
              ) : (
                <div className="mt-6">
                  <button
                    onClick={() => handleTogglePrimaryBank(bankAccount.id)}
                    className="text-primary text-[11px] font-bold uppercase tracking-wide hover:underline"
                  >
                    Đặt làm mặc định
                  </button>
                </div>
              )}
            </div>
          ))}
          {dataBankAccount.length < 2 && (
            <button
              onClick={() => setIsShowBankForm(true)}
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group hover:border-primary/50 transition-all min-h-[250px]"
            >
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-primary">
                <IoMdAddCircleOutline className="text-3xl" />
              </div>
              <span className="font-bold text-slate-400 group-hover:text-primary">
                Thêm tài khoản mới
              </span>
            </button>
          )}
        </>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex gap-3">
        <MdInfoOutline className="text-blue-500" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Tài khoản ngân hàng của bạn được mã hóa và bảo mật. Chúng tôi không
          lưu trữ thông tin nhạy cảm như mã PIN hay mật khẩu ngân hàng của bạn.
        </p>
      </div>
      <BankAccountForm
        isShowBankForm={isShowBankForm}
        setIsShowBankForm={setIsShowBankForm}
      />
    </section>
  );
}

export default BankAccountpage;
