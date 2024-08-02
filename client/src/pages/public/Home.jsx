import React, { useState, useEffect } from "react";
import { Sidebar, Banner, BestSeller, DealDaily } from "../../components";
import { apiGetProducts } from "@/apis";
import FeaturedProducts from "@/components/FeaturedProducts";

const Home = () => {
  return (
    <>
      <div className="w-main flex">
        <div className="flex flex-col gap-5 w-[25%] flex-auto ">
          <Sidebar />
          <DealDaily />
        </div>
        <div className="flex flex-col gap-5 pl-5  w-[75%] flex-auto ">
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className="my-8">
        <FeaturedProducts />
      </div>
      <div className="w-full h-[500px]"></div>
    </>
  );
};

export default Home;
