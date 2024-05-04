import React, { useState, useEffect } from "react";
import { apiGetCategories } from "@/apis/app";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [categories, setCategories] = useState(null);

  const fetchProductCategories = async () => {
    const response = await apiGetCategories();
    if (response.success) setCategories(response.productCategory);
  };

  useEffect(() => {
    fetchProductCategories();
  }, []);
  console.log(categories);

  return (
    <div className="flex flex-col gap-5">
      {categories.map((el) => (
        <NavLink to={el.title} key={el._id}>
          {el.title}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
