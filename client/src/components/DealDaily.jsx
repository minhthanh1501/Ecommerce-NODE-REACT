import { apiGetProducts } from "@/apis";
import {
  formatMoney,
  renderStarFromNumber,
  SecondsToHms,
} from "@/utils/helpers";
import icons from "@/utils/icons";
import React, { useEffect, useState, memo } from "react";
import Countdown from "./Countdown";
import moment from "moment";
let idInterval;
const DealDaily = () => {
  const { AiFillStar, AiOutlineMenu } = icons;
  const [dealDaily, setDealDaily] = useState(null);
  const [hour, sethour] = useState(0);
  const [minute, setminute] = useState(0);
  const [second, setsecond] = useState(0);
  const [expireTime, setExpireTime] = useState(false);

  const fetchDealDaily = async () => {
    const response = await apiGetProducts({
      limit: 1,
      page: Math.round(Math.random() * 10),
      totalRatings: 5,
    });
    if (response.success) {
      setDealDaily(response.products[0]);

      const today = `${moment().format("MM/DD/YYYY")} 00:00:00`;
      const seconds =
        new Date(today).getTime() - new Date().getTime() + 24 * 3600 * 1000;
      const number = SecondsToHms(seconds);
      sethour(number.h);
      setminute(number.m);
      setsecond(number.s);
    } else {
      sethour(0);
      setminute(59);
      setsecond(59);
    }
  };

  // useEffect(() => {
  //   fetchDealDaily();
  // }, []);

  useEffect(() => {
    idInterval && clearInterval(idInterval);
    fetchDealDaily();
  }, [expireTime]);

  useEffect(() => {
    idInterval = setInterval(() => {
      if (second > 0) setsecond((prev) => prev - 1);
      else {
        if (minute > 0) {
          setminute((prev) => prev - 1);
          setsecond(59);
        } else {
          if (hour > 0) {
            sethour((prev) => prev - 1);
            setminute(59);
            setsecond(59);
          } else {
            setExpireTime((prev) => !prev);
          }
        }
      }
    }, 1000);
    return () => {
      clearInterval(idInterval);
    };
  }, [hour, minute, second, expireTime]);

  return (
    <div className="border w-full flex-auto ">
      <div className="flex items-center justify-between p-4 w-full">
        <span className="flex-1 flex justify-center">
          <AiFillStar size={20} color="#DD1111" />
        </span>
        <span className="flex-8 font-bold text-20[px] flex justify-center">
          DEAL DAILY
        </span>
        <span className="flex-1 "></span>
      </div>
      <div className="w-full flex flex-col items-center pt-8 px-4 gap-2">
        <img
          src={
            dealDaily?.thumb ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfXs6Ed5Kh_V1wG_3EEzrp-7s7XQmBSAKAMgvcTja_fg&s"
          }
          alt="image"
          className="w-full object-contain"
        />
        <span className="line-clamp-1 text-center">{dealDaily?.title}</span>
        <span className="flex h-4">
          {renderStarFromNumber(dealDaily?.totalRatings, 20)}
        </span>
        <span>{formatMoney(dealDaily?.price)} VND</span>
      </div>
      <div className="px-4 mt-8">
        <div className="flex justify-center gap-2 items-center mb-4">
          <Countdown unit={"Hours"} number={hour} />
          <Countdown unit={"Minutes"} number={minute} />
          <Countdown unit={"Seconds"} number={second} />
        </div>
        <button
          type="button"
          className="flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white font-medium py-2"
        >
          <AiOutlineMenu />
          <span>Options</span>
        </button>
      </div>
    </div>
  );
};

export default memo(DealDaily);
