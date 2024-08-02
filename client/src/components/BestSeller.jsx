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
  const [products, setProducts] = useState(null);

  const fetchProducts = async () => {
    const response = await Promise.all([
      apiGetProducts({ sort: "-sold" }),
      apiGetProducts({ sort: "-createdAt" }),
    ]);
    if (response[0].success) {
      setBestSellers(response[0].products);
      setProducts(response[0].products);
    }
    if (response[1].success) {
      setNewProducts(response[1].products);
      setProducts(response[1].products);
    }

    // console.log();
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    if (activedTab === 1) setProducts(bestSellers);
    if (activedTab === 2) setProducts(newProducts);
  }, [activedTab]);
  // console.log(bestSellers)
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
        <Slider {...settings}>
          {bestSellers?.map((el) => (
            <Product
              key={el._id}
              pid={el._id}
              productData={el}
              isNew={activedTab === 1 ? false : true}
            />
          ))}
        </Slider>
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
