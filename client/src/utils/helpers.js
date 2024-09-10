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

export const validate = (payload, setInvalidFields) => {
  let invalids = 0; // count invalid fields , 0 => all valid fields

  const formatPayload = Object.entries(payload);
  console.log(formatPayload);

  for (let arr of formatPayload) {
    if (arr[1].trim() === "") {
      invalids++;
      setInvalidFields((prev) => [
        ...prev,
        { name: arr[0], mes: "Require this field" },
      ]);
    }
  }

  for (let arr of formatPayload) {
    switch (arr[0]) {
      case "email":
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!arr[1].match(regex)) {
          invalids++;
          setInvalidFields((prev) => [
            ...prev,
            { name: arr[0], mes: "Email Invalid." },
          ]);
        }
        break;
      case "password":
        if (!arr[1].length < 6) {
          invalids++;
          setInvalidFields((prev) => [
            ...prev,
            { name: arr[0], mes: "Password must have at least 6 character." },
          ]);
        }
        break;

      default:
        break;
    }
  }

  return invalids; // return > 0 => have invalid field
};
