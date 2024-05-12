import { apiGetProducts } from "@/apis";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Slider from "react-slick";
import { Product } from ".";

const tabs = [
  { id: 1, name: "best sellers" },
  { id: 2, name: "new arrivals" },
  { id: 3, name: "tablet" },
];

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const BestSeller = () => {
  // const { products } = useSelector((state) => state.product);
  // console.log(products);
  const [bestSellers, setBestSellers] = useState(null);
  const [newProducts, setNewProducts] = useState(null);
  const [activedTab, setActivedTab] = useState(1);

  const fetchProducts = async () => {
    const response = await Promise.all([
      apiGetProducts({ sort: "-sold" }),
      apiGetProducts({ sort: "-createdAt" }),
    ]);
    if (response[0].success) setBestSellers(response[0].products);
    if (response[1].success) setNewProducts(response[1].products);

    // console.log();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex text-[20px] gap-8 pb-4 border-main border-b-2">
        {tabs.map((el) => (
          <span
            key={el.id}
            // className={`font-semibold uppercase border-r text-gray-600 ${
            //   activedTab === el.id ? "text-green" : ""
            // }`}
            className={twMerge(
              clsx(
                "font-semibold uppercase border-r text-gray-600",
                activedTab === el.id ? "text-black cursor-pointer" : ""
              )
            )}
            onClick={() => setActivedTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <Slider {...settings}>
          {bestSellers?.map((el) => (
            <Product key={el._id} productData={el} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BestSeller;
