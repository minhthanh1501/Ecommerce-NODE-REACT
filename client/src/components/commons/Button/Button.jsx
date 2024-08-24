import React from "react";

const Button = ({
  name,
  handleOnClick,
  style,
  iconsBefore,
  iconsAfter,
  fw,
}) => {
  return (
    <button
      type="button"
      className={
        style
          ? style
          : `my-2 px-4 py-2 rounded-md text-white bg-main font-semibold hover:opacity-80 ${
              fw ? "w-full" : "w-fit"
            }`
      }
      onClick={() => {
        handleOnClick && handleOnClick();
      }}
    >
      {iconsBefore}
      <span>{name}</span>
      {iconsAfter}
    </button>
  );
};

export default Button;
