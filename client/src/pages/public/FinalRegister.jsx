import path from "@/utils/path";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const FinalRegister = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (status == "failed")
      Swal.fire("Oop!", "Đăng ký không thành công", "error").then(() => {
        navigate(`/${path.LOGIN}`);
      });
    if (status == "success")
      Swal.fire("Congratulation!", "Đăng ký thành công", "success").then(() => {
        navigate(`/${path.LOGIN}`);
      });
  }, []);

  return <div className="h-screen w-screen bg-gray-100"></div>;
};

export default FinalRegister;
