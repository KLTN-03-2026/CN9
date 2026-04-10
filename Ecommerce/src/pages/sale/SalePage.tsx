import { FaRegSave } from "react-icons/fa";
import { MdOutlineSort } from "react-icons/md";
import { IoFilterSharp } from "react-icons/io5";

import Header from "../../components/common/Header";
import SearchInput from "../../components/common/SearchInput";

import SaleList from "../../components/sale/SaleList";
import SaleForm from "../../components/sale/SaleForm";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import { SaleType } from "../../types/SaleType";

import { getAllSales } from "../../api/saleApi";

import { useToast } from "../../hook/useToast";

function SalePage() {
  const { showToast } = useToast();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [dataSales, setDataSales] = useState<SaleType[]>([]);

  const [idSale, setIdSale] = useState<number | null>(null);

  const [inputSearch, setInputSearch] = useState<{ searchSale: string }>({
    searchSale: "",
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getDataAllSales = async (search?: string) => {
    try {
      const resSales = await getAllSales(search);
      setDataSales(resSales.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDataAllSales();
  }, []);

  function handleSearchSale(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setInputSearch((prev) => ({
      ...prev,
      searchSale: value,
    }));

    if (!value.trim()) {
      getDataAllSales();
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      getDataAllSales(value);
    }, 500);
  }

  return (
    <>
      <Header
        title="Danh sách Sale"
        content="Quản lý, tìm kiếm và tạo các Sale cho cửa hàng của bạn."
        component={
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpenModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-background-dark hover:opacity-90"
            >
              <FaRegSave className="text-lg" />
              <span>Thêm mã giảm giá</span>
            </button>
          </div>
        }
      />
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <SearchInput
            value={inputSearch.searchSale}
            placeholder="Tìm kiếm mã voucher..."
            onChange={handleSearchSale}
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
        <SaleList
          dataSales={dataSales}
          setIdSale={setIdSale}
          onReloadSale={getDataAllSales}
          setIsOpenModal={setIsOpenModal}
        />
        <nav className="flex flex-wrap items-center justify-between pt-4 mt-6">
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
      <SaleForm
        idSale={idSale}
        setIdSale={setIdSale}
        isOpenModal={isOpenModal}
        onReloadSale={getDataAllSales}
        setIsOpenModal={setIsOpenModal}
      />
    </>
  );
}

export default SalePage;
