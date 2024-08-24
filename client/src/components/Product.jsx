import { formatMoney, renderStarFromNumber } from "@/utils/helpers";
import React, { useState } from "react";
import label from "../assets/label.png";
import labelgreen from "../assets/label-green.png";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { SelectOption } from ".";
import icons from "@/utils/icons";
import { Link } from "react-router-dom";
import path from "@/utils/path";

const Product = ({ productData, isNew }) => {
  const [isShowOption, setIsShowOption] = useState(false);
  const { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } = icons;
  return (
    <div className="w-full text-base px-[10px]">
      <Link
        to={`/${path.DETAIL_PRODUCT}/${productData?._id}/${productData?.title}`}
        className="w-full border p-[15px] flex flex-col items-center"
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsShowOption(false);
        }}
      >
        <div className="w-full relative">
          {isShowOption && (
            <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
              <SelectOption icon={<AiFillEye />} />
              <SelectOption icon={<AiOutlineMenu />} />
              <SelectOption icon={<BsFillSuitHeartFill />} />
            </div>
          )}
          <img
            src={
              productData?.thumb ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfXs6Ed5Kh_V1wG_3EEzrp-7s7XQmBSAKAMgvcTja_fg&s"
            }
            alt="image"
            className="w-[274px] h-[274px] object-cover"
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
          <span className="flex">
            {renderStarFromNumber(productData.totalRatings)?.map(
              (el, index) => {
                <span key={index}>{el}</span>;
              }
            )}
          </span>
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{formatMoney(productData?.price)} VND</span>
        </div>
      </Link>
    </div>
  );
};

export default Product;
