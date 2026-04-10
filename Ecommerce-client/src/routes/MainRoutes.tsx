import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import MainLayout from "../layout/MainLayout";

import PaymentRoutes from "./PaymentRoutes";
import UserInfoRoutes from "./UserInfoRoutes";

import HomePage from "../pages/home/HomePage";
import CartPage from "../pages/cart/CartPage";
import LoginPage from "../pages/login/LoginPage";
import ChatAIPage from "../pages/chatAI/ChatAIPage";
import RegisterPage from "../pages/register/RegisterPage";
import CategoryPage from "../pages/category/CategoryPage";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import CollectionsPage from "../pages/collections/CollectionsPage";

import { clearOrder } from "../redux/order/orderSlice";

function MainRoutes() {
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    console.log(!location.pathname.startsWith("/payment"));

    if (!location.pathname.startsWith("/payment")) {
      dispatch(clearOrder());
    }
  }, [location.pathname]);
  
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chatAI" element={<ChatAIPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/info/*" element={<UserInfoRoutes />} />
        <Route path="/payment/*" element={<PaymentRoutes />} />
        <Route path="/category/:slug?" element={<CategoryPage />} />
        <Route path="/detail/:slug" element={<ProductDetailPage />} />
        <Route
          path="/collections/:collectionKey?"
          element={<CollectionsPage />}
        />
      </Route>
    </Routes>
  );
}

export default MainRoutes;
