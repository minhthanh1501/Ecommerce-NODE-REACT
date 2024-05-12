import React from "react";

const Product = ({ productData }) => {
  return (
    <div className="w-1/3">
      <img
        src={
          productData?.thumb ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfXs6Ed5Kh_V1wG_3EEzrp-7s7XQmBSAKAMgvcTja_fg&s"
        }
        alt="image"
        className="w-full object-contain"
      />
    </div>
  );
};

export default Product;
