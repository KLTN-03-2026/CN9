import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import "./App.css";

import MainRoutes from "./routes/MainRoutes";

import { useDispatch } from "react-redux";

import { getInfoAccount } from "./api/userApi";

import { login } from "./redux/auth/authSlice";
import { getProductsToCart } from "./api/cartApi";
import { setCart } from "./redux/cart/cartSlice";

function App() {
  const dispatch = useDispatch();

  // const { showToast } = useToast();

  const navigate = useNavigate();

  const getInfoUser = async () => {
    try {
      const [resUser, resCart] = await Promise.all([
        getInfoAccount(),
        getProductsToCart(),
      ]);
      // showToast(resUser.message, resUser.type);
      dispatch(login(resUser.data));
      dispatch(setCart(resCart.data));
    } catch (error) {
      // showToast("Vui lòng đăng nhập", "error");
      navigate("/login");
    }
  };

  useEffect(() => {
    getInfoUser();
  }, []);

  return (
    <Routes>
      <Route path="/*" element={<MainRoutes />} />;
    </Routes>
  );
}

export default App;
