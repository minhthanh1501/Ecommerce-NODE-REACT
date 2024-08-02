import { formatMoney, renderStarFromNumber } from "@/utils/helpers";
import React from "react";

const ProductCard = ({ image, title, totalRatings, price }) => {
  return (
    <div className="w-1/3 flex-auto px-[10px] mb-[20px]">
      <div className="flex w-full border-[#d7d7d7] border">
        <img
          src={image}
          alt="products"
          className="w-[120px] object-contain p-4"
        />
        <div className="flex flex-col gap-1 mt-[15px] items-start w-full text-xs">
          <span className="line-clamp-1 text-sm capitalize">
            {title.toLowerCase()}
          </span>
          <span className="flex">{renderStarFromNumber(totalRatings, 14)}</span>
          <span>{formatMoney(price)} VND</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
