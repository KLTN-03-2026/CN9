import Header from "../common/Header";
import Button from "../common/Button";
import ButtonBack from "../common/ButtonBack";
import ButtonIconDelete from "../common/ButtonIconDelete";

import { FaRegSave } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";

import { useNavigate } from "react-router-dom";

import { Modal } from "antd";
import SearchInput from "../common/SearchInput";

interface OrderCreateFormProps {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function OrderCreateForm({
  isOpenModal,
  setIsOpenModal,
}: OrderCreateFormProps) {
  return (
    <Modal
      open={isOpenModal}
      onCancel={() => setIsOpenModal((prev) => !prev)}
      closable={false}
      footer={null}
      width="auto"
    >
      <Header
        title="Tạo đơn hàng mới"
        content="Điền thông tin dưới đây để tạo một đơn hàng mới"
        component={
          <>
            <Button
              title="Hủy"
              onClick={() => setIsOpenModal((prev) => !prev)}
              className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
            />
            <Button
              title="Lưu đơn hàng"
              icon={<FaRegSave className="text-xl" />}
              onClick={() => {}}
            />
          </>
        }
      />
      <div className="grid grid-cols-3 gap-8 mt-4">
        <div className="col-span-3 lg:col-span-2 flex flex-col gap-8">
          <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
            <div className="p-6 border-b border-border-light dark:border-border-dark">
              <h2 className="text-lg font-semibold">Thông tin khách hàng</h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label
                    className="text-sm font-medium mb-1 block"
                    htmlFor="customer-name"
                  >
                    Tên khách hàng
                  </label>
                  <input
                    className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                    id="customer-name"
                    type="text"
                    defaultValue="Trần Văn An"
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-medium mb-1 block"
                    htmlFor="customer-email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                    id="customer-email"
                    type="email"
                    defaultValue="tranvanan@email.com"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
            <div className="p-6 border-b border-border-light dark:border-border-dark">
              <h2 className="text-lg font-semibold">Sản phẩm</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <SearchInput
                  value=""
                  onChange={() => {}}
                  placeholder="Tìm kiếm sản phẩm..."
                />
                <Button title="Thêm sản phẩm" onClick={() => {}} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-muted-light dark:text-text-muted-dark">
                      <th className="py-3 px-4 font-medium">Sản phẩm</th>
                      <th className="py-3 px-4 font-medium">Đơn giá</th>
                      <th className="py-3 px-4 font-medium">Số lượng</th>
                      <th className="py-3 px-4 font-medium text-right">
                        Thành tiền
                      </th>
                      <th className="py-3 px-4 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-light dark:border-border-dark">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="size-12 rounded-lg bg-cover bg-center flex-shrink-0"
                            style={{
                              backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYFW1vUNxk3ZpFQUP9Lf3sYBEpjXs8_35fPHGn0-yvZfEgZx2Uao4zd6vXScFn9crrvU_pcrcKKtzM9TV82UNdEFX7-bLKv1WqHqDHR3xgqYWReMdAYGnH6fHTv2ApMEkWn2vVsNlQBPGcuRQJUPQc1IXdFhs0eXbF-apMf_lXpUPOCm-zwn6kpEqrf8zIAuH7rtPccm0VQtr9a2obR69xQNwnuOp1Ksv_YY_ic6gFmyn9lH3X5G1dMjDGBWRPD8Wogpv_NBxQ5Us")',
                            }}
                          />
                          <div className="flex flex-col">
                            <p className="font-medium">Áo thun thể thao</p>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                              Màu: Đen, Size: L
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">350.000đ</td>
                      <td className="py-3 px-4">
                        <input
                          className="w-16 text-center px-2 py-1 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-1 focus:ring-primary/50"
                          type="number"
                          defaultValue={2}
                        />
                      </td>
                      <td className="py-3 px-4 text-right">700.000đ</td>
                      <td className="py-3 px-4 text-right">
                        <ButtonIconDelete />
                      </td>
                    </tr>
                    <tr className="border-b border-border-light dark:border-border-dark">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="size-12 rounded-lg bg-cover bg-center flex-shrink-0"
                            style={{
                              backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYFW1vUNxk3ZpFQUP9Lf3sYBEpjXs8_35fPHGn0-yvZfEgZx2Uao4zd6vXScFn9crrvU_pcrcKKtzM9TV82UNdEFX7-bLKv1WqHqDHR3xgqYWReMdAYGnH6fHTv2ApMEkWn2vVsNlQBPGcuRQJUPQc1IXdFhs0eXbF-apMf_lXpUPOCm-zwn6kpEqrf8zIAuH7rtPccm0VQtr9a2obR69xQNwnuOp1Ksv_YY_ic6gFmyn9lH3X5G1dMjDGBWRPD8Wogpv_NBxQ5Us")',
                            }}
                          />
                          <div className="flex flex-col">
                            <p className="font-medium">Quần Jeans ống rộng</p>
                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                              Màu: Xanh, Size: 32
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">550.000đ</td>
                      <td className="py-3 px-4">
                        <input
                          className="w-16 text-center px-2 py-1 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-1 focus:ring-primary/50"
                          type="number"
                          defaultValue={1}
                        />
                      </td>
                      <td className="py-3 px-4 text-right">550.000đ</td>
                      <td className="py-3 px-4 text-right">
                        <ButtonIconDelete />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3 lg:col-span-1 flex flex-col gap-8">
          <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
            <div className="p-6 border-b border-border-light dark:border-border-dark">
              <h2 className="text-lg font-semibold">Tóm tắt đơn hàng</h2>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  Tạm tính
                </p>
                <p className="font-medium">1.250.000đ</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  Phí vận chuyển
                </p>
                <p className="font-medium">30.000đ</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  Giảm giá
                </p>
                <p className="font-medium text-danger">- 0đ</p>
              </div>
              <div className="border-t border-border-light dark:border-border-dark my-2" />
              <div className="flex justify-between font-semibold">
                <p>Tổng cộng</p>
                <p>1.280.000đ</p>
              </div>
            </div>
            <div className="p-6 border-t border-border-light dark:border-border-dark">
              <label
                className="text-sm font-medium mb-1 block"
                htmlFor="discount-code"
              >
                Mã giảm giá
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
                  id="discount-code"
                  placeholder="Nhập mã"
                  type="text"
                />
                <Button
                  title="Áp dụng"
                  className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
                  onClick={() => {}}
                />
              </div>
            </div>
          </div>
          <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
            <div className="p-6 border-b border-border-light dark:border-border-dark">
              <h2 className="text-lg font-semibold">
                Giao hàng &amp; Thanh toán
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label
                  className="text-sm font-medium mb-1 block"
                  htmlFor="shipping-address"
                >
                  Địa chỉ giao hàng
                </label>
                <input
                  className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                  type="text"
                />
              </div>
              <div>
                <label
                  className="text-sm font-medium mb-1 block"
                  htmlFor="payment-method"
                >
                  Phương thức thanh toán
                </label>
                <select
                  className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="payment-method"
                >
                  <option>Thanh toán khi nhận hàng (COD)</option>
                  <option>Chuyển khoản ngân hàng</option>
                  <option>Thanh toán qua ví điện tử</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default OrderCreateForm;
