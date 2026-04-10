import { IoMdAdd } from "react-icons/io";

import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import SearchInput from "../../components/common/SearchInput";

import ProductForm from "../../components/product/ProductForm";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import ProductList from "../../components/product/ProductList";
import { CategoryType } from "../../types/CategoryType";
import { getAllCategory } from "../../api/categoryApi";
import { useToast } from "../../hook/useToast";
import { getAllProducts } from "../../api/productApi";
import { ProductType } from "../../types/ProductType";

function ProductPage() {
  const { showToast } = useToast();

  const [idProduct, setIsProduct] = useState<null | number>(null);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [dataCategories, setDataCategories] = useState<CategoryType[]>([]);

  const [selectCatetory, setSelectCategory] = useState(0);

  const [inputSearch, setInputSearch] = useState<{ searchProduct: string }>({
    searchProduct: "",
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [dataProducts, setDataProducts] = useState<ProductType[]>([]);

  const getDataProducts = async (search?: string) => {
    try {
      const resProducts = await getAllProducts(search);
      setDataProducts(resProducts.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  const getDataSelectForProduct = async () => {
    try {
      const resCategories = await getAllCategory();
      setDataCategories(resCategories.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDataSelectForProduct();
    getDataProducts();
  }, []);

  function handleSearchProduct(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setInputSearch((prev) => ({
      ...prev,
      searchProduct: value,
    }));

    if (!value.trim()) {
      getDataProducts();
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      getDataProducts(value);
    }, 500);
  }

  return (
    <>
      <Header
        title="Quản lý sản phẩm"
        content="Xem, thêm, sửa, xóa và quản lý sản phẩm của bạn"
        component={
          <Button
            title="Thêm sản phẩm"
            icon={<IoMdAdd className="text-lg" />}
            onClick={() => setIsOpenModal((prev) => !prev)}
          />
        }
      />
      <div className="mt-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchInput
            value={inputSearch.searchProduct}
            onChange={handleSearchProduct}
            placeholder="Tìm kiếm sản phẩm..."
          />
          <select
            onChange={(e) => {
              setSelectCategory(Number(e.target.value));
            }}
            className="rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-muted-light dark:text-text-muted-dark"
          >
            <option value={0}>Tất cả danh mục</option>
            {dataCategories.map((cate) => {
              return (
                <option key={cate.id} value={cate.id}>
                  {cate.name}
                </option>
              );
            })}
          </select>
          <select className="rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-muted-light dark:text-text-muted-dark">
            <option>Tất cả trạng thái</option>
            <option>Còn hàng</option>
            <option>Hết hàng</option>
            <option>Sắp hết hàng</option>
          </select>
        </div>
      </div>
      <ProductList
        dataProducts={dataProducts}
        selectCatetory={selectCatetory}
        setIsProduct={setIsProduct}
        setIsOpenModal={setIsOpenModal}
      />
      <ProductForm
        getDataProducts={getDataProducts}
        idProduct={idProduct}
        isOpenModal={isOpenModal}
        dataCategories={dataCategories}
        setIsOpenModal={setIsOpenModal}
        setIsProduct={setIsProduct}
      />
    </>
  );
}

export default ProductPage;
