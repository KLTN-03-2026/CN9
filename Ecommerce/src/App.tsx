import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import MainRoutes from "./routes/MainRoutes";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useToast } from "./hook/useToast";
import { login } from "./redux/auth/authSlice";
import { getInfoAccount } from "./api/authApi";

function App() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  const navigate = useNavigate();

  const getInfoUser = async () => {
    try {
      const resUser = await getInfoAccount();
      showToast(resUser.message, resUser.type);
      dispatch(login(resUser.data));
    } catch (error) {
      showToast("Vui lòng đăng nhập", "error");
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
