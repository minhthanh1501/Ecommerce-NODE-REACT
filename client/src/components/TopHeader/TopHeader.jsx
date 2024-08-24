import path from "@/utils/path";
import React from "react";
import { Link } from "react-router-dom";

const TopHeader = () => {
  return (
    <div className="h-[38px] w-full bg-main flex items-center justify-center">
      <div className="w-main flex items-center justify-between text-xs text-white">
        <span>ORDER ONLINE OR CALL US (+84) 000 9099</span>
        <Link to={`/${path.LOGIN}`} className="hover:text-gray-800">
          Sign In or Create Account
        </Link>
      </div>
    </div>
  );
};

export default TopHeader;
