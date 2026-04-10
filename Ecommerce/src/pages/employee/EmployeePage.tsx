import { IoMdAdd } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";

import Header from "../../components/common/Header";
import Button from "../../components/common/Button";

import EmployeeForm from "../../components/employee/EmployeeForm";
import EmployeeList from "../../components/employee/EmployeeList";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Pagination } from "antd";

import { useToast } from "../../hook/useToast";

import { EmployeeType } from "../../types/EmployeeType";

import { getAllEmployees } from "../../api/employeeApi";
import SearchInput from "../../components/common/SearchInput";

function EmployeePage() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [page, setPage] = useState<number>(1);

  const [totalRole, setTotalRole] = useState(0);

  const limtRoles = 10;

  const { showToast } = useToast();

  const [inputSearch, setInputSearch] = useState<{ searchEmployee: string }>({
    searchEmployee: "",
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [dataEmployee, setDataEmpolyee] = useState<EmployeeType[]>([]);

  const [idEmployee, setIdEmployee] = useState<number | null>(null);

  const getDateAllEmployee = async (search?: string) => {
    try {
      const resEmployee = await getAllEmployees(limtRoles, page, search);
      setDataEmpolyee(resEmployee.data);
      setTotalRole(resEmployee.total);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDateAllEmployee();
  }, [page]);

  function handleSearchEmployee(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setInputSearch((prev) => ({
      ...prev,
      searchEmployee: value,
    }));

    if (!value.trim()) {
      getDateAllEmployee();
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      getDateAllEmployee(value);
    }, 500);
  }

  return (
    <>
      <Header
        title="Danh sách nhân viên"
        content="Quản lý thông tin nhân viên của bạn"
        component={
          <Button
            title="Thêm Nhân viên"
            icon={<IoMdAdd className="text-lg" />}
            onClick={() => setIsOpenModal(true)}
          />
        }
      />
      <div className="mt-8">
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <SearchInput
              value={inputSearch.searchEmployee}
              onChange={handleSearchEmployee}
              placeholder="Tìm kiếm nhân viên...."
            />
          </div>
          <EmployeeList
            dataEmployee={dataEmployee}
            setIdEmployee={setIdEmployee}
            onReloadEmployee={getDateAllEmployee}
          />
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 sm:mb-0">
              Hiển thị{" "}
              <span className="font-medium">{(page - 1) * limtRoles + 1}</span>{" "}
              - <span className="font-medium">{page * limtRoles}</span> trên{" "}
              <span className="font-medium">{totalRole}</span> Nhân viên
            </p>
            <Pagination
              current={page}
              total={totalRole}
              pageSize={limtRoles}
              onChange={(e) => setPage(e)}
            />
          </div>
        </div>
      </div>
      <EmployeeForm isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
    </>
  );
}

export default EmployeePage;
