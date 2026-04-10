import Button from "../../components/common/Button";
import HeaderPage from "../../components/common/Header";

import { FaHistory, FaRegSave } from "react-icons/fa";
import { MdOutlinePerson, MdOutlineToll, MdPhotoCamera } from "react-icons/md";
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";

import { useParams } from "react-router-dom";

import { getUserById, updateUserById } from "../../api/userApi";

import { useToast } from "../../hook/useToast";

import { useEffect, useState } from "react";
import { InfoUserType, UpdateUserType } from "../../types/UserType";

function CustomerDetailPage() {
  const { showToast } = useToast();

  const { id } = useParams();

  const [dataInfoUser, setDataUserInfoUser] = useState<InfoUserType | null>(
    null,
  );

  const [inputInfoUser, setInputInfoUser] = useState<UpdateUserType>({
    address: "",
    email: "",
    name: "",
    phone: "",
    point: 0,
    avatar: "",
    description: "",
    type: "increase",
  });

  const [imageSrcAvatar, setImageSrcAvatar] = useState<string>();

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputInfoUser, string>>
  >({});

  const getDataUserById = async (id: number) => {
    try {
      const resUser = await getUserById(id);
      setDataUserInfoUser(resUser.data);
      setInputInfoUser({ ...resUser.data, type: "increase" });

      showToast(resUser.message, resUser.type);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDataUserById(Number(id));
  }, []);

  function handleChangeInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setInputInfoUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      const readerFile = new FileReader();

      readerFile.onload = function (e) {
        if (e.target?.result) {
          setImageSrcAvatar(e.target.result as string);
          setInputInfoUser((prev) => ({
            ...prev,
            avatar: file,
          }));
        }
      };

      readerFile.readAsDataURL(file);
    }
  }

  function buildUpdateFormData(data: UpdateUserType) {
    const formData = new FormData();
    let hasChange = false;

    if (data.name !== dataInfoUser?.name) {
      formData.append("name", data.name);
      hasChange = true;
    }

    if (data.email !== dataInfoUser?.email) {
      formData.append("email", data.email);
      hasChange = true;
    }

    if (data.address !== dataInfoUser?.address) {
      formData.append("address", data.address);
      hasChange = true;
    }

    if (data.point !== dataInfoUser?.points) {
      const deltaPoint =
        data.type === "decrease" ? -Number(data.point) : Number(data.point);

      formData.append("points", deltaPoint.toString());
      hasChange = true;
    }

    if (data.phone !== dataInfoUser?.phone) {
      formData.append("phone", data.phone);
      hasChange = true;
    }

    if (inputInfoUser.avatar) {
      formData.append("avatarUser", inputInfoUser.avatar);
      hasChange = true;
    }

    if (inputInfoUser.description) {
      formData.append("description", inputInfoUser.description);
      hasChange = true;
    }

    if (inputInfoUser.type) {
      formData.append("type", inputInfoUser.type);
      hasChange = true;
    }

    return hasChange ? formData : null;
  }

  const handleSubmitInfoUser = async (id: number) => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputInfoUser.name) {
        newErrors.name = "Vui lòng nhập tên thể loại";
      }

      if (!inputInfoUser.address) {
        newErrors.address = "Vui lòng nhập mô tả thể loại";
      }

      if (!inputInfoUser.email) {
        newErrors.email = "Vui lòng nhập mô tả thể loại";
      }

      if (!inputInfoUser.phone) {
        newErrors.phone = "Vui lòng nhập mô tả thể loại";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const formDataUser = buildUpdateFormData(inputInfoUser);

      if (!formDataUser) {
        showToast("Không có gì thay đổi", "warning");
        return;
      }

      if (!id) {
        showToast("Lỗi người dùng", "warning");
        return;
      }

      const resUser = await updateUserById(id, formDataUser);

      setInputInfoUser({
        address: "",
        description: "",
        email: "",
        name: "",
        phone: "",
        point: 0,
        type: "increase",
        avatar: "",
      });
      getDataUserById(id);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  return (
    <>
      <HeaderPage
        title="Cập nhật Hồ sơ & Điều chỉnh Điểm"
        content="Quản lý thông tin chi tiết và số dư điểm thưởng của khách hàng thân thiết."
        component={
          <>
            <Button
              title="Hủy"
              onClick={() => {}}
              className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
            />
            <Button
              title="Cập nhập thông tin"
              icon={<FaRegSave className="text-xl" />}
              onClick={() => {
                handleSubmitInfoUser(Number(id));
              }}
            />
          </>
        }
      />
      <div className="bg-white dark:bg-white/5 border border-primary/10 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <img
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 shadow-md transition-all"
              src={`${
                imageSrcAvatar
                  ? imageSrcAvatar
                  : "https://lh3.googleusercontent.com/aida-public/AB6AXuBxrLoqLFpB8QTbz10BVp9re0BgLeyMwDeAjg9-_dH3WOgLIBoSKfyY6XVIYlIaLDrkNHW8dHWnGOQZ_MMaDyRiND99aciTEdfiH7MdNJhxUJYiwWRXMpcSDHN16X0EDwWsVIi6DU6AwBJyipuRJHgoU9NS5nI_ZCLYqkgGkT5zT-64PaTPELwUWnxFmwr3hM1KFbK7JOi3BrggcA5vwxRptag4PFN97bznwZNDJ9ToxOTRdbcRoeHa1SISxPn9iIDMsZEHTG6fBAY"
              }`}
              alt=""
            />
            <label
              className="absolute bottom-0 right-0 bg-primary text-[#102214] p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
              htmlFor="avatar-upload"
            >
              <MdPhotoCamera className="text-sm" />
              <input
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                type="file"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <div className="flex flex-col text-center md:text-left">
            <p className="text-[#0d1c11] dark:text-white text-3xl font-bold leading-tight">
              {dataInfoUser?.name}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                ID: {dataInfoUser?.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-white/5 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-primary/10">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MdOutlinePerson className="text-primary" size={30} />
                Thông tin cá nhân
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#4b9b5f] dark:text-primary/80">
                  Họ và tên
                </label>
                <input
                  className="bg-background-light dark:bg-background-dark/50 border-primary/20 rounded-lg focus:ring-primary focus:border-primary text-base px-4 py-2.5"
                  type="text"
                  value={inputInfoUser.name}
                  onChange={handleChangeInput}
                  name="name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#4b9b5f] dark:text-primary/80">
                  Email
                </label>
                <input
                  className="bg-background-light dark:bg-background-dark/50 border-primary/20 rounded-lg focus:ring-primary focus:border-primary text-base px-4 py-2.5"
                  type="email"
                  value={inputInfoUser.email}
                  onChange={handleChangeInput}
                  name="email"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#4b9b5f] dark:text-primary/80">
                  Số điện thoại
                </label>
                <input
                  className="bg-background-light dark:bg-background-dark/50 border-primary/20 rounded-lg focus:ring-primary focus:border-primary text-base px-4 py-2.5"
                  type="tel"
                  value={inputInfoUser.phone}
                  onChange={handleChangeInput}
                  name="phone"
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-[#4b9b5f] dark:text-primary/80">
                  Địa chỉ
                </label>
                <textarea
                  className="bg-background-light dark:bg-background-dark/50 border-primary/20 rounded-lg focus:ring-primary focus:border-primary text-base px-4 py-2.5"
                  rows={3}
                  value={inputInfoUser.address}
                  onChange={handleChangeInput}
                  name="address"
                />
              </div>
            </div>
          </section>
          <section className="bg-white dark:bg-white/5 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-primary/10">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FaHistory className="text-primary" />
                Lịch sử thay đổi gần đây
              </h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-background-light dark:bg-background-dark/30 text-[#4b9b5f] dark:text-primary/80 uppercase font-bold">
                  <tr>
                    <th className="px-6 py-3">Ngày</th>
                    <th className="px-6 py-3">Hành động</th>
                    <th className="px-6 py-3">Số điểm</th>
                    <th className="px-6 py-3">Lý do</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {dataInfoUser?.pointHistory.map((pointH) => {
                    const timeCreate = new Date(
                      pointH.createdAt,
                    ).toLocaleDateString("vi-VN");
                    return (
                      <tr>
                        <td className="px-6 py-4">{timeCreate}</td>
                        <td
                          className={`px-6 py-4 ${
                            pointH.type === "increase"
                              ? "text-primary"
                              : "text-red-500"
                          } font-medium`}
                        >
                          {pointH.type === "increase" ? "Cộng" : "Trừ"} điểm
                        </td>
                        <td className="px-6 py-4 font-bold">
                          {pointH.type === "increase" ? "+" : ""}{" "}
                          {pointH.points}
                        </td>
                        <td className="px-6 py-4">{pointH.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <div className="lg:col-span-1">
          <section className="bg-white dark:bg-white/5 rounded-xl border-2 border-primary shadow-lg overflow-hidden sticky top-24">
            <div className="bg-primary p-6 text-[#102214]">
              <h3 className="text-xl font-black flex items-center gap-2">
                <MdOutlineToll />
                Cập nhật điểm thưởng
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-primary/10 rounded-lg p-4 flex justify-between items-center border border-primary/20">
                <span className="text-sm font-bold text-[#4b9b5f] dark:text-primary/80 uppercase">
                  Số dư hiện tại
                </span>
                <span className="text-3xl font-black text-primary">
                  {dataInfoUser?.points}
                </span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#4b9b5f] dark:text-primary/80">
                  Chọn hành động
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setInputInfoUser((prev) => ({
                        ...prev,
                        type: "increase",
                      }));
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 ${
                      inputInfoUser.type === "increase"
                        ? " border-primary bg-primary text-[#102214] font-bold"
                        : "border-primary/20 text-primary font-bold hover:bg-primary/10"
                    } transition-all`}
                  >
                    <IoMdAddCircleOutline size={25} />
                    Cộng
                  </button>
                  <button
                    onClick={() => {
                      setInputInfoUser((prev) => ({
                        ...prev,
                        type: "decrease",
                      }));
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 ${
                      inputInfoUser.type === "decrease"
                        ? " border-primary bg-primary text-[#102214] font-bold"
                        : "border-primary/20 text-primary font-bold hover:bg-primary/10"
                    } transition-all`}
                  >
                    <IoMdRemoveCircleOutline size={25} />
                    Trừ
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#4b9b5f] dark:text-primary/80">
                  Số điểm cần điều chỉnh
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-background-light dark:bg-background-dark/50 border-primary/20 rounded-lg focus:ring-primary focus:border-primary text-xl font-bold px-4 py-3"
                    placeholder="Nhập số điểm..."
                    type="number"
                    value={inputInfoUser.point}
                    onChange={handleChangeInput}
                    name="point"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold">
                    PTS
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#4b9b5f] dark:text-primary/80">
                  Lý do thay đổi
                </label>
                <textarea
                  className="w-full bg-background-light dark:bg-background-dark/50 border-primary/20 rounded-lg focus:ring-primary focus:border-primary text-base px-4 py-2.5"
                  placeholder="Nhập lý do chi tiết..."
                  rows={4}
                  value={inputInfoUser.description}
                  onChange={handleChangeInput}
                  name="description"
                />
              </div>
              <div className="pt-4 border-t border-primary/10 flex justify-between items-center">
                <span className="text-sm font-medium opacity-70 italic">
                  Số dư dự kiến:
                </span>
                <span className="text-lg font-bold">
                  {dataInfoUser?.points !== undefined &&
                  inputInfoUser.point !== undefined
                    ? Number(dataInfoUser?.points) + Number(inputInfoUser.point)
                    : 0}{" "}
                  pts
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default CustomerDetailPage;
