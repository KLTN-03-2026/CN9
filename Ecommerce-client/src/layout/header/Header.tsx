import { FaStore } from "react-icons/fa";
import { IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, type ChangeEvent } from "react";

import { searchProduct } from "../../api/productApi";

import { formatMoneyString } from "../../utils/formatPrice";
import type { RootState } from "../../redux/store/store";
import type { ProductSearch } from "../../type/ProductType";

function Header() {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const totalQuantityInCart = useSelector(
    (state: RootState) => state.cart.totalQuantity,
  );

  const [inputProduct, setInputProduct] = useState<{ search: string }>({
    search: "",
  });

  const [dataProductSearch, setDataProductSearch] = useState<ProductSearch[]>(
    [],
  );

  const handleSearchProduct = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputProduct((prev) => ({ ...prev, search: value }));

    if (value.trim() === "") {
      setDataProductSearch([]);
      return;
    }

    setTimeout(async () => {
      const products = await searchProduct(value);
      setDataProductSearch(products.data);
    }, 1000);
  };

  function handleClickProduct(slug: string) {
    navigate("/detail/" + slug);
    setDataProductSearch([]);
    setInputProduct({ search: "" });
  }

  return (
    <header className="whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-6 md:px-10 py-3 bg-background-light dark:bg-background-dark top-0 z-50">
      <div className="container flex items-center justify-between ">
        <div className="flex items-center gap-8">
          <Link
            to={"/"}
            className="flex items-center gap-2 text-text-light dark:text-text-dark"
          >
            <FaStore className="text-3xl text-primary" />
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
              BrandName
            </h2>
          </Link>
        </div>
        <div className="hidden md:flex flex-1 justify-around">
          <div className="relative w-full max-w-lg group">
            <label className="flex flex-col w-full !h-12">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
                <div className="text-text-light/70 dark:text-text-dark/70 flex border-none bg-border-light dark:bg-card-dark items-center justify-center pl-4 rounded-l-xl border border-r-0 border-border-light dark:border-border-dark">
                  <IoSearchOutline />
                </div>
                <input
                  className="focus:outline-none focus:ring-0 form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border bg-border-light dark:bg-card-dark h-full placeholder:text-text-light/70 dark:placeholder:text-text-dark/70 px-4 border-l-0 text-base font-normal leading-normal border-border-light dark:border-border-dark"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={inputProduct.search}
                  name="search"
                  onChange={handleSearchProduct}
                />
              </div>
            </label>

            <div
              className={`${dataProductSearch.length === 0 || inputProduct.search === "" ? "hidden" : ""} absolute top-full left-0 right-0 mt-2 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg overflow-hidden text-left z-10`}
            >
              <ul className="divide-y divide-border-light dark:divide-border-dark">
                {dataProductSearch.slice(0, 6).map((product) => {
                  return (
                    <li
                      onClick={() => handleClickProduct(product.slug)}
                      className="p-4 hover:bg-primary/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          className="w-12 h-12 object-cover rounded-lg"
                          src={product.image_url[0]}
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-text-light dark:text-text-dark text-base">
                            {product.name}
                          </p>
                          <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                            {product.categoryName}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-text-light dark:text-text-dark">
                          {formatMoneyString(product.price)}đ
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/category"}
              className="flex h-10 cursor-pointer items-center justify-center rounded-lg bg-transparent px-4 text-sm font-bold leading-normal tracking-[0.015em] text-text-light/70 dark:text-text-dark/70 hover:bg-primary/20 hover:text-text-light dark:hover:text-text-dark"
            >
              Thể loại
            </Link>
            <Link
              to={"/chatAI"}
              className="flex h-10 cursor-pointer items-center justify-center rounded-lg bg-transparent px-4 text-sm font-bold leading-normal tracking-[0.015em] text-text-light/70 dark:text-text-dark/70 hover:bg-primary/20 hover:text-text-light dark:hover:text-text-dark"
            >
              Chat AI
            </Link>
            <Link
              to={"/collections/sale"}
              className="flex h-10 cursor-pointer items-center justify-center rounded-lg bg-transparent px-4 text-sm font-bold leading-normal tracking-[0.015em] text-text-light/70 dark:text-text-dark/70 hover:bg-primary/20 hover:text-text-light dark:hover:text-text-dark"
            >
              Sale
            </Link>
            <Link
              to={"/category/nam"}
              className="flex h-10 cursor-pointer items-center justify-center rounded-lg bg-transparent px-4 text-sm font-bold leading-normal tracking-[0.015em] text-text-light/70 dark:text-text-dark/70 hover:bg-primary/20 hover:text-text-light dark:hover:text-text-dark"
            >
              Nam
            </Link>
            <Link
              to={"/category/nu"}
              className="flex h-10 cursor-pointer items-center justify-center rounded-lg bg-transparent px-4 text-sm font-bold leading-normal tracking-[0.015em] text-text-light/70 dark:text-text-dark/70 hover:bg-primary/20 hover:text-text-light dark:hover:text-text-dark"
            >
              Nữ
            </Link>
            <Link
              to={"/category/unisex"}
              className="flex h-10 cursor-pointer items-center justify-center rounded-lg bg-transparent px-4 text-sm font-bold leading-normal tracking-[0.015em] text-text-light/70 dark:text-text-dark/70 hover:bg-primary/20 hover:text-text-light dark:hover:text-text-dark"
            >
              Unisex
            </Link>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {user ? (
            <>
              <Link to={"/info"}>
                <img
                  src={
                    user.avatar ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuA5mo65JZvjKp6Szj-9f6BMvLAMW89ZuWAlR7dfbBBRLzLgk-3ui66PriRFoPiKVS1Ie7mLTCDItRYvtv72cHYjgEySRDtmZ6iWZshlG5dhl-8b0IrV54im9IxSeR4qbQ6iOFYCRyyaZIYwjO_LX_rIYaamw7Yx3A3-bwSvFaqJ7NGNu_fqbOdS2WSil1TSr2G64iwa8o9_Cz5oU1EmTThK01_-lzYYkx1UwqE44JQRfQGn9zTv9mJLzeyDQt97Et6WwCNx-9yOXhs"
                  }
                  alt=""
                  className="cursor-pointer h-10 w-10 rounded-full bg-cover bg-center bg-no-repeat"
                />
              </Link>
              <Link to={"/cart"}>
                <button className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-transparent text-text-light dark:text-text-dark hover:bg-primary/20">
                  <FiShoppingCart className="text-xl" />
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {totalQuantityInCart}
                  </span>
                </button>
              </Link>
            </>
          ) : (
            <Link to={"/login"}>
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-transparent text-text-light dark:text-text-dark hover:bg-primary/20 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                <IoPersonOutline className="text-xl" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
