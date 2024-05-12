import { formatMoney } from "@/utils/helpers";
import React from "react";
import label from "../assets/label.png";
import labelgreen from "../assets/label-green.png";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const Product = ({ productData, isNew }) => {
  return (
    <div className="w-full text-base px-[10px]">
      <div className="w-full border p-[15px] flex flex-col items-center">
        <div className="w-full relative">
          <img
            src={
              productData?.thumb ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfXs6Ed5Kh_V1wG_3EEzrp-7s7XQmBSAKAMgvcTja_fg&s"
            }
            alt="image"
            className="w-[243px] h-[243px] object-cover"
          />
          <img
            src={isNew ? label : labelgreen}
            alt=""
            className="absolute  object-contain -top-7 -left-[39px] w-[115px]"
          />

          <span
            className={twMerge(
              clsx(
                "absolute -top-2 left-[-13px] font-semibold text-white",
                isNew ? "" : "text-sm"
              )
            )}
          >
            {isNew ? "New" : "Trending"}
          </span>
        </div>
        <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{formatMoney(productData?.price)} VND</span>
          <span>{productData?.totalRatings}</span>
        </div>
      </div>
    </div>
  );
};

export default Product;
