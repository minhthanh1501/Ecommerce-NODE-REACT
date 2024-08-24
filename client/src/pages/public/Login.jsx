import Button from "@/components/commons/Button";
import InputField from "@/components/commons/InputField";
import React, { useCallback, useState } from "react";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);

  const [payload, setPayload] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = useCallback(() => {
    console.log(payload);
  }, [payload]);

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
            <InputField
              value={payload.name}
              setValue={setPayload}
              nameKey="name"
            />
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
