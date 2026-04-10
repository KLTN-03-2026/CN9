import { MdAdd, MdOutlineSort } from "react-icons/md";
import { IoFilterSharp } from "react-icons/io5";

import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import SearchInput from "../../components/common/SearchInput";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import VoucherForm from "../../components/voucher/VoucherForm";
import VoucherList from "../../components/voucher/VoucherList";

import { VoucherType } from "../../types/VoucherType";

import { getAllVouchers } from "../../api/voucherApi";

import { useToast } from "../../hook/useToast";

function VoucherPage() {
  const { showToast } = useToast();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [dataVouchers, setDataVouchers] = useState<VoucherType[]>([]);

  const [idVoucher, setIdVoucher] = useState<number | null>(null);

  const [inputSearch, setInputSearch] = useState<{ searchVoucher: string }>({
    searchVoucher: "",
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getDataAllVouchers = async (search?: string) => {
    try {
      const resVouchers = await getAllVouchers(search);
      setDataVouchers(resVouchers.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDataAllVouchers();
  }, []);

  function handleSearchVoucher(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setInputSearch((prev) => ({
      ...prev,
      searchVoucher: value,
    }));

    if (!value.trim()) {
      getDataAllVouchers();
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      getDataAllVouchers(value);
    }, 500);
  }

  return (
    <>
      <Header
        title="Danh sách Voucher"
        content="Quản lý, tìm kiếm và tạo các Voucher cho cửa hàng của bạn"
        component={
          <Button
            title="Tạo voucher mới"
            icon={<MdAdd className="text-lg" />}
            onClick={() => setIsOpenModal(true)}
          />
        }
      />
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <SearchInput
            value={inputSearch.searchVoucher}
            placeholder="Tìm kiếm mã voucher..."
            onChange={handleSearchVoucher}
          />
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark">
                <IoFilterSharp className="text-base" />
                <span>Lọc theo trạng thái</span>
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark">
                <MdOutlineSort className="text-base" />
                <span>Sắp xếp</span>
              </button>
            </div>
          </div>
        </div>
        <VoucherList
          dataVouchers={dataVouchers}
          setIdVoucher={setIdVoucher}
          onReloadVoucher={getDataAllVouchers}
          setIsOpenModal={setIsOpenModal}
        />
        <nav
          aria-label="Table navigation"
          className="flex flex-wrap items-center justify-between pt-4 mt-6"
        >
          <span className="text-sm font-normal text-text-muted-light dark:text-text-muted-dark">
            Hiển thị{" "}
            <span className="font-semibold text-text-light dark:text-text-dark">
              1-5
            </span>{" "}
            của{" "}
            <span className="font-semibold text-text-light dark:text-text-dark">
              100
            </span>
          </span>
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <a
                className="px-3 py-2 ml-0 leading-tight text-text-muted-light dark:text-text-muted-dark bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-l-lg hover:bg-background-light dark:hover:bg-background-dark hover:text-text-light dark:hover:text-text-dark"
                href="#"
              >
                Trước
              </a>
            </li>
            <li>
              <a
                className="px-3 py-2 leading-tight text-text-muted-light dark:text-text-muted-dark bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark hover:text-text-light dark:hover:text-text-dark"
                href="#"
              >
                1
              </a>
            </li>
            <li>
              <a
                className="px-3 py-2 leading-tight text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark hover:text-text-light dark:hover:text-text-dark"
                href="#"
              >
                2
              </a>
            </li>
            <li>
              <a
                aria-current="page"
                className="z-10 px-3 py-2 leading-tight border text-primary bg-primary/10 border-primary/50"
                href="#"
              >
                3
              </a>
            </li>
            <li>
              <a
                className="px-3 py-2 leading-tight text-text-muted-light dark:text-text-muted-dark bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark hover:text-text-light dark:hover:text-text-dark"
                href="#"
              >
                ...
              </a>
            </li>
            <li>
              <a
                className="px-3 py-2 leading-tight text-text-muted-light dark:text-text-muted-dark bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark hover:text-text-light dark:hover:text-text-dark"
                href="#"
              >
                10
              </a>
            </li>
            <li>
              <a
                className="px-3 py-2 leading-tight text-text-muted-light dark:text-text-muted-dark bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-r-lg hover:bg-background-light dark:hover:bg-background-dark hover:text-text-light dark:hover:text-text-dark"
                href="#"
              >
                Sau
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <VoucherForm
        idVoucher={idVoucher}
        isOpenModal={isOpenModal}
        setIdVoucher={setIdVoucher}
        setIsOpenModal={setIsOpenModal}
        onReloadVoucher={getDataAllVouchers}
      />
    </>
  );
}

export default VoucherPage;
