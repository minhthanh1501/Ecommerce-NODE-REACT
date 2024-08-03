import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { createSlug } from "@/utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "@/store/app/asyncActions";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <div className="flex flex-col border">
      {categories?.map((el) => (
        <NavLink
          to={createSlug(el.title)}
          key={createSlug(el.title)}
          className={({ isActive }) =>
            isActive
              ? "bg-main text-white px-5 pt-[15px] pb-[14px] text-sm hover:text-main"
              : "px-5 pt-[15px] pb-[14px] text-sm hover:text-main"
          }
        >
          {el.title}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
