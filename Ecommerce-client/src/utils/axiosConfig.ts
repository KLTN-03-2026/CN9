import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3002/api",
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.log("401 từ interceptor");
      // logout();           // nếu có
      // navigate("/login"); // để ở UI layer cũng được
    }

    return Promise.reject(error); // 🔥 bắt buộc
  }
);

export default instance;
