import { apiResetPassword } from "@/apis/user";
import Button from "@/components/commons/Button";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState();
  const { token } = useParams();

  const handleResetPassword = async () => {
    const response = await apiResetPassword({ password, token });

    if (response.success) {
      toast.success(response.mes);
    } else {
      toast.error(response.mes);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 bg-overlay flex flex-col items-center py-8 animate-slide-right">
      <div className="flex flex-col gap-4 bg-gray-600 p-4 rounded">
        <label htmlFor="password">Enter your new password:</label>
        <input
          type="text"
          id="password"
          className="w-[800px] p-2 border-b outline-none rounded placeholder:text-sm"
          placeholder="Type here"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex items-center gap-2 justify-end mt-4">
          <Button name={"Submit"} handleOnClick={handleResetPassword} />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
