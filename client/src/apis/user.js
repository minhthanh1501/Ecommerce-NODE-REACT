import axios from "../axios";

export const apiRegister = (data) => {
  return axios.post("/user/register", data, { withCredentials: true });
};

export const apiLogin = (data) => {
  return axios.post("/user/login", data);
};

export const apiForgotPassword = (data) => {
  return axios.post("/user/forgotpassword", data);
};

export const apiResetPassword = (data) => {
  return axios.put("/user/resetpassword", data);
};
