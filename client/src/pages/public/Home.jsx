import React, { useState, useEffect } from "react";
import { Sidebar, Banner, BestSeller, DealDaily } from "../../components";
import FeaturedProducts from "@/components/FeaturedProducts";
import CustomSlider from "@/components/CustomSlider";
import { useSelector } from "react-redux";
import icons from "@/utils/icons";

const Home = () => {
  const { newProducts } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.app);

  const { IoIosArrowForward } = icons;

  return (
    <>
      <div className="w-main flex">
        <div className="flex flex-col gap-5 w-[25%] flex-auto ">
          <Sidebar />
          {/* <DealDaily /> */}
        </div>
        <div className="flex flex-col gap-5 pl-5  w-[75%] flex-auto ">
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className="my-8">
        <FeaturedProducts />
      </div>
      <div className="my-8">
        <h2 className="text-[20px] font-semibold py-[15px] border-main border-b-2">
          NEW ARRIVALS
        </h2>
        <div className=" mt-4">
          <CustomSlider products={newProducts} />
        </div>
      </div>
      <div className="my-8">
        <h2 className="text-[20px] font-semibold py-[15px] border-main border-b-2">
          HOT COLLECTIONS
        </h2>
        <div className="flex flex-wrap gap-4 min-h-[190px]">
          {categories
            ?.filter((el) => el.brand.length > 0)
            .map((item, index) => (
              <div key={index} className="w-[396px] p-2 gap-4">
                <div className="border flex">
                  <img
                    src={item.image}
                    alt="images"
                    className="flex-1 w-[144px] h-[129px] object-cover"
                  />
                  <div className="flex-1 text-gray-700">
                    <h4 className="font-semibold uppercase">{item.title}</h4>
                    <ul className="text-sm">
                      {item.brand?.map((el) => (
                        <span className="flex gap-2 text-gray-500">
                          <IoIosArrowForward size={14} />
                          <li key={el}>{el}</li>
                        </span>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="my-8 w-full">
          <h2 className="text-[20px] font-semibold py-[15px] border-main border-b-2">
            BLOG POSTS
          </h2>
        </div>
      </div>
      <div className="w-full h-[500px] bg-main">FOOTER</div>
    </>
  );
};

export default Home;
