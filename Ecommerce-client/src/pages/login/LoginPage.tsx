import { useNavigate } from "react-router-dom";

import { MdOutlineVisibility } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { login } from "../../redux/auth/authSlice";
import { loginUser } from "../../api/userApi";
import { getProductsToCart } from "../../api/cartApi";
import { setCart } from "../../redux/cart/cartSlice";

function LoginPage() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // const { showToast } = useToast();

  const [isShowPass, setIsShowPass] = useState<boolean>(false);

  const [input, setInput] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof input, string>>
  >({});

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmitLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const newErrors: Partial<typeof errors> = {};

      if (!input.email) {
        newErrors.email = "Vui lòng nhập email của bạn";
      }

      if (!input.password) {
        newErrors.password = "Vui lòng nhập password của bạn";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data = {
        email: input.email,
        password: input.password,
      };

      const resLogin = await loginUser(data);

      // showToast(resLogin.message, resLogin.type);

      const resCart = await getProductsToCart();
      
      dispatch(login(resLogin.data));

      dispatch(setCart(resCart.data));

      navigate("/");
    } catch (error) {
      // showToast("Đăng nhập thất bại", "error");
    }
  };

  return (
    <div className="flex w-full items-center justify-center bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-[#0d1c11] dark:text-white tracking-tight text-3xl font-bold leading-tight font-display">
            Chào mừng trở lại!
          </h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-300 font-display">
            Vui lòng đăng nhập.
          </p>
        </div>
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button className="flex-1 py-3 px-4 text-center font-medium text-lg border-b-2 border-primary text-primary dark:text-primary font-display">
            Đăng nhập
          </button>
        </div>
        <form
          className="mt-8 space-y-6"
          method="POST"
          onSubmit={handleSubmitLogin}
        >
          <div className="space-y-4 rounded-md">
            <div className="flex flex-col">
              <input
                autoComplete="email"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d1c11] dark:text-white focus:outline-0 focus:ring-0 border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal font-display"
                id="email-address"
                name="email"
                placeholder="Email của bạn"
                required
                type="email"
                value={input.email}
                onChange={handleChangeInput}
              />
              <p className="text-red-500 font-medium">{errors.email}</p>
            </div>
            <div className="flex flex-col">
              <div className="relative flex w-full flex-1 items-stretch">
                <input
                  autoComplete="current-password"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-[#0d1c11] dark:text-white focus:outline-0 focus:ring-0 border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-[15px] border-r-0 text-base font-normal leading-normal font-display"
                  id="password"
                  name="password"
                  placeholder="Mật khẩu"
                  required
                  type={isShowPass ? "text" : "password"}
                  value={input.password}
                  onChange={handleChangeInput}
                />
                <button
                  className="text-gray-500 dark:text-gray-400 flex items-center justify-center px-4 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark"
                  type="button"
                  onClick={() => {
                    setIsShowPass((prev) => !prev);
                  }}
                >
                  <MdOutlineVisibility className="text-2xl" />
                </button>
              </div>
              <p className="text-red-500 font-medium">{errors.password}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/50 bg-background-light dark:bg-background-dark dark:border-gray-600"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label
                className="ml-2 block text-sm text-gray-900 dark:text-gray-200 font-display"
                htmlFor="remember-me"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>
            <div className="text-sm">
              <a
                className="font-medium text-primary/80 hover:text-primary font-display"
                href="#"
              >
                Quên mật khẩu?
              </a>
            </div>
          </div>
          <div>
            <button
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-primary py-4 px-4 text-base font-bold text-black hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark font-display transition-colors"
              type="submit"
            >
              Đăng nhập
            </button>
          </div>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background-light dark:bg-background-dark px-2 text-gray-500 dark:text-gray-400 font-display">
              Hoặc tiếp tục với
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark py-3 px-4 text-center text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background-dark focus:ring-gray-500 font-display">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M16.403 10.232c0-.638-.057-1.255-.166-1.854H10v3.498h3.585c-.155.986-.63 1.83-1.385 2.392v2.262h2.908c1.7-1.564 2.68-3.878 2.68-6.3zm-6.403 8.168c2.34 0 4.304-0.773 5.738-2.09l-2.908-2.262c-.78.524-1.77.832-2.83.832-2.175 0-4.016-1.464-4.67-3.42H2.1v2.332C3.545 16.488 6.545 18.4 10 18.4zM4.183 11.41C3.99 10.875 3.882 10.31 3.882 9.71s0.108-1.165 0.3-1.7l-2.78-2.15C1.03 6.94 0.69 8.27 0.69 9.71c0 1.44 0.34 2.77 0.933 3.95l2.56-1.25zM10 3.95c1.272 0 2.42.438 3.325 1.304l2.585-2.585C14.304 1.25 12.34 0 10 0 6.545 0 3.545 1.912 2.1 4.86l2.78 2.15C5.984 5.414 7.825 3.95 10 3.95z"
                fillRule="evenodd"
              />
            </svg>
            Google
          </button>
          <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark py-3 px-4 text-center text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background-dark focus:ring-gray-500 font-display">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                fillRule="evenodd"
              />
            </svg>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
