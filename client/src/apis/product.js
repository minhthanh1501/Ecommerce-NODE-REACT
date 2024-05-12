import axios from "../axios";

export const apiGetProducts =  () =>
  axios({
    url: "/product/",
    method: "get",
    
  });
