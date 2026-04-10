import { IoMdAdd } from "react-icons/io";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import SearchInput from "../../components/common/SearchInput";

import { useEffect, useState } from "react";

import CustomerForm from "../../components/customer/CustomerForm";
import CustomerList from "../../components/customer/CustomerList";

import { UserType } from "../../types/UserType";

import { useToast } from "../../hook/useToast";

import { getAllUsers, searchUser } from "../../api/userApi";

function CustomerPage() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [inputSearch, setInputSearch] = useState<{ searchCustomer: string }>({
    searchCustomer: "",
  });

  const { showToast } = useToast();

  const [dataUser, setDataUser] = useState<UserType[]>([]);

  const getDataAllUser = async () => {
    try {
      const resUser = await getAllUsers();
      showToast(resUser.message, resUser.type);
      setDataUser(resUser.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDataAllUser();
  }, []);

  useEffect(() => {
    if (!inputSearch.searchCustomer) {
      getDataAllUser();
      return;
    }

    setTimeout(async () => {
      const users = await searchUser(inputSearch.searchCustomer);
      setDataUser(users.data);
    }, 500);
  }, [inputSearch.searchCustomer]);

  return (
    <>
      <Header
        title="Danh sách khách hàng"
        content="Quản lý thông tin khách hàng của bạn"
      />
      <div className="mt-8">
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <SearchInput
              value={inputSearch.searchCustomer}
              onChange={(e) =>
                setInputSearch((prev) => ({
                  ...prev,
                  searchCustomer: e.target.value,
                }))
              }
              placeholder="Tìm kiếm khách hàng...."
            />
            <Button
              title="Thêm Khách hàng"
              icon={<IoMdAdd className="text-lg" />}
              onClick={() => setIsOpenModal((prev) => !prev)}
            />
          </div>
          <CustomerList dataUser={dataUser} onReloadCustomer={getDataAllUser} />
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 sm:mb-0">
              Hiển thị <span className="font-medium">1</span> -{" "}
              <span className="font-medium">5</span> trên{" "}
              <span className="font-medium">128</span> khách hàng
            </p>
            <div className="flex items-center gap-2">
              <button className="flex items-center justify-center size-9 rounded-lg border border-border-light dark:border-border-dark hover:bg-primary/20 disabled:opacity-50">
                <FaAngleLeft size={12} className="text-xl" />
              </button>
              <button className="flex items-center justify-center size-9 rounded-lg border border-border-light dark:border-border-dark bg-primary/20 font-medium">
                1
              </button>
              <button className="flex items-center justify-center size-9 rounded-lg border border-border-light dark:border-border-dark hover:bg-primary/20">
                2
              </button>
              <button className="flex items-center justify-center size-9 rounded-lg border border-border-light dark:border-border-dark hover:bg-primary/20">
                3
              </button>
              <span className="px-2">...</span>
              <button className="flex items-center justify-center size-9 rounded-lg border border-border-light dark:border-border-dark hover:bg-primary/20">
                26
              </button>
              <button className="flex items-center justify-center size-9 rounded-lg border border-border-light dark:border-border-dark hover:bg-primary/20">
                <FaAngleRight size={12} className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <CustomerForm
        onReloadCustomer={getDataAllUser}
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </>
  );
}

export default CustomerPage;
