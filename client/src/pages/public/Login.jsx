import { apiLogin, apiRegister } from "@/apis/user";
import Button from "@/components/commons/Button";
import InputField from "@/components/commons/InputField";
import path from "@/utils/path";
import React, { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { register } from "@/store/user/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    mobile: "",
  });

  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      mobile: "",
    });
  };

  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, ...data } = payload;
    if (isRegister) {
      const response = await apiRegister(payload);
      if (response.success) {
        Swal.fire("Congratulation", response.mes, "success").then(() => {
          setIsRegister(false);
          resetPayload();
        });
      } else Swal.fire("Oop!", response.mes, "error");
    } else {
      const response = await apiLogin(data);
      if (response.success) {
        dispatch(
          register({
            isLoggedIn: true,
            token: response.accessToken,
            userData: response.userData,
          })
        );
        navigate(`/${path.HOME}`);
      } else Swal.fire("Oop!", response.mes, "error");
    }
  }, [payload, isRegister]);

  return (
    <div className="w-screen h-screen relative">
      <img
        src="https://www.ssi-schaefer.com/resource/blob/1444662/b5bdadcababc0904a574ea9d675870c3/e-commerce-hero-dam-image-en-31561--data.jpg"
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex">
        <div className="p-8 flex flex-col items-center border-gray-400 border rounded-md w-1/2">
          <h1 className=" text-[28px] font-semibold text-main mb-8">
            {isRegister ? "Register" : "Login"}
          </h1>
          {isRegister && (
            <div className="flex items-center gap-2">
              <InputField
                value={payload.firstname}
                setValue={setPayload}
                nameKey="firstname"
              />
              <InputField
                value={payload.lastname}
                setValue={setPayload}
                nameKey="lastname"
              />
              <InputField
                value={payload.mobile}
                setValue={setPayload}
                nameKey="mobile"
              />
            </div>
          )}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey="email"
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey="password"
            type={"password"}
          />
          <Button
            name={isRegister ? "Register" : "Login"}
            handleOnClick={handleSubmit}
            fw
          />
          <div className="flex items-center justify-between my-2 w-full text-sm">
            {!isRegister && (
              <span className="text-blue-500 hover:underline cursor-pointer">
                Forgot your account?
              </span>
            )}
            <span
              className={`text-blue-500 hover:underline cursor-pointer ${
                isRegister && "w-full text-center"
              }`}
              onClick={() => setIsRegister((prev) => !prev)}
            >
              {!isRegister ? "Create account" : "Back to Login"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
