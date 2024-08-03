import { apiGetProducts } from "@/apis";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useDispatch, useSelector } from "react-redux";
import { getNewProducts } from "@/store/product/asyncAction";
import CustomSlider from "./CustomSlider";

const tabs = [
  { id: 1, name: "best sellers" },
  { id: 2, name: "new arrivals" },
  { id: 3, name: "tablet" },
];

const BestSeller = () => {
  // const { products } = useSelector((state) => state.product);
  // console.log(products);
  const [bestSellers, setBestSellers] = useState(null);
  const [activedTab, setActivedTab] = useState(1);
  const [products, setProducts] = useState(null);

  const dispatch = useDispatch();
  const { newProducts } = useSelector((state) => state.products);

  const fetchProducts = async () => {
    const response = await apiGetProducts({ sort: "-sold" });
    if (response?.success) {
      setBestSellers(response.products);
      setProducts(response.products);
    }
  };

  useEffect(() => {
    fetchProducts();
    dispatch(getNewProducts());
  }, []);

  useEffect(() => {
    if (activedTab === 1) setProducts(bestSellers);
    if (activedTab === 2) setProducts(newProducts);
  }, [activedTab]);

  return (
    <div>
      <div className="flex text-[20px] pb-4 -ml-[32px]">
        {tabs.map((el) => (
          <span
            key={el.id}
            // className={`font-semibold uppercase border-r text-gray-600 ${
            //   activedTab === el.id ? "text-green" : ""
            // }`}
            className={twMerge(
              clsx(
                "font-semibold uppercase px-8 border-r text-gray-600  cursor-pointer",
                activedTab === el.id ? "text-black" : ""
              )
            )}
            onClick={() => setActivedTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="mt-2 border-main border-t-2 pt-4">
        <CustomSlider products={products} activedTab={activedTab} />
      </div>
      <div className="w-full mt-4 gap-4 flex">
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
          alt="banner-left"
          className="flex-1 object-contain"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
          alt="banner-right"
          className="flex-1 object-contain"
        />
      </div>
    </div>
  );
};

export default BestSeller;
