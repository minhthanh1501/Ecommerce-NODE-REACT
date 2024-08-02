import icons from "./icons";

const { AiOutlineStar, AiFillStar } = icons;

export const createSlug = (string) =>
  string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("-");

export const formatMoney = (number) => {
  if (number === undefined || number === null) {
    return "0";
  }
  return Number(number.toFixed(1)).toLocaleString();
};

export const renderStarFromNumber = (number, size) => {
  if (!Number(number)) return;
  // 4 => [1,1,1,1,0]
  // 2 => [1,1,0,0,0]
  const stars = [];
  for (let i = 0; i < +number; i++)
    stars.push(<AiFillStar key={i} color="orange" size={size || 16} />);
  for (let i = 5; i > +number; i--)
    stars.push(<AiOutlineStar key={i} color="orange" size={size || 16} />);

  return stars;
};

export const SecondsToHms = (d) => {
  d = Number(d) / 1000;
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  return {
    h,
    m,
    s,
  };
};
