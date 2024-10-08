import { apiForgotPassword, apiLogin, apiRegister } from "@/apis/user";
import Button from "@/components/commons/Button";
import InputField from "@/components/commons/InputField";
import path from "@/utils/path";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { login } from "@/store/user/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { validate } from "@/utils/helpers";

const Login = () => {
  const [isShowModalForgotPassword, setIsShowModalForgotPassword] =
    useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [invalidFields, setInValidFields] = useState([]);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    if (response.success) {
      toast.success(response.mes);
    } else {
      toast(response.mes);
    }
  };

  // handlesubmit
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, ...data } = payload;

    const invalids = isRegister
      ? validate(payload, setInValidFields)
      : validate(data, setInValidFields);

    if (invalids === 0) {
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
            login({
              isLoggedIn: true,
              token: response.accessToken,
              userData: response.userData,
            })
          );
          navigate(`/${path.HOME}`);
        } else Swal.fire("Oop!", response.mes, "error");
      }
    }
  }, [payload, isRegister]);

  useEffect(() => {
    resetPayload();
  }, [isRegister]);

  return (
    <div className="w-screen h-screen relative">
      {isShowModalForgotPassword && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 bg-overlay flex flex-col items-center py-8 animate-slide-right">
          <div className="flex flex-col gap-4 bg-gray-600 p-4 rounded">
            <label htmlFor="email">Enter your email:</label>
            <input
              type="text"
              id="email"
              className="w-[800px] p-2 border-b outline-none rounded placeholder:text-sm"
              placeholder="Exp: email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex items-center gap-2 justify-end mt-4">
              <Button name={"Submit"} handleOnClick={handleForgotPassword} />
              <Button
                name={"Back"}
                handleOnClick={() => setIsShowModalForgotPassword(false)}
              />
            </div>
          </div>
        </div>
      )}
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
                invalidFields={invalidFields}
                setInValidFields={setInValidFields}
              />
              <InputField
                value={payload.lastname}
                setValue={setPayload}
                nameKey="lastname"
                invalidFields={invalidFields}
                setInValidFields={setInValidFields}
              />
              <InputField
                value={payload.mobile}
                setValue={setPayload}
                nameKey="mobile"
                invalidFields={invalidFields}
                setInValidFields={setInValidFields}
              />
            </div>
          )}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey="email"
            invalidFields={invalidFields}
            setInValidFields={setInValidFields}
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey="password"
            type={"password"}
            invalidFields={invalidFields}
            setInValidFields={setInValidFields}
          />
          <Button
            name={isRegister ? "Register" : "Login"}
            handleOnClick={handleSubmit}
            fw
          />
          <div className="flex items-center justify-between my-2 w-full text-sm">
            {!isRegister && (
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => setIsShowModalForgotPassword(true)}
              >
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
