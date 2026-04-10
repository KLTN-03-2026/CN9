import { MdAddCircleOutline } from "react-icons/md";

import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import SearchInput from "../../components/common/SearchInput";

import CategoryForm from "../../components/category/CategoryForm";
import CategoryList from "../../components/category/CategoryList";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import { useToast } from "../../hook/useToast";

import { CategoryType } from "../../types/CategoryType";

import { getAllCategory } from "../../api/categoryApi";

function CategoryPage() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [idCategory, setIdCategory] = useState<number | null>(null);

  const { showToast } = useToast();

  const [dataCategory, setDataCategory] = useState<CategoryType[]>([]);

  const [inputSearch, setInputSearch] = useState<{ searchCategory: string }>({
    searchCategory: "",
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getdataCategory = async (search?: string) => {
    try {
      const resCategory = await getAllCategory(search);
      // showToast(resCategory.message, resCategory.type);
      setDataCategory(resCategory.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getdataCategory();
  }, []);

  function handleSearchCategory(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setInputSearch((prev) => ({
      ...prev,
      searchCategory: value,
    }));

    if (!value.trim()) {
      getdataCategory();
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      getdataCategory(value);
    }, 500);
  }

  return (
    <>
      <Header
        title="Thể loại sản phẩm"
        content="Quản lý các thể loại quần áo trong hệ thống của bạn."
        component={
          <Button
            title="Thêm thể loại"
            icon={<MdAddCircleOutline className="text-xl" />}
            onClick={() => setIsOpenModal(true)}
          />
        }
      />
      <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark mt-6">
        <div className="p-4 border-b border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center gap-4">
          <SearchInput
            value={inputSearch.searchCategory}
            onChange={handleSearchCategory}
            placeholder="Tìm kiếm thể loại sản phẩm...."
          />
        </div>
        <CategoryList
          dataCategory={dataCategory}
          setIsOpenModal={setIsOpenModal}
          setIdCategory={setIdCategory}
          searchCategory={inputSearch.searchCategory}
        />
        <div className="p-4 border-t border-border-light dark:border-border-dark flex items-center justify-between">
          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Hiển thị 1-5 trên 12 kết quả
          </span>
          <div className="inline-flex items-center gap-2">
            <button
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:bg-primary/10 disabled:opacity-50"
              disabled
            >
              Trước
            </button>
            <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:bg-primary/10">
              Sau
            </button>
          </div>
        </div>
      </div>
      <CategoryForm
        getdataCategory={getdataCategory}
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        idCategory={idCategory}
        setIdCategory={setIdCategory}
      />
    </>
  );
}

export default CategoryPage;
