import { URL, endpoints } from "./environment.json";
import "./callApi";
import { axiosget, axiospostjson, axiospost } from "./callApi";

export const login = (loginDetails, callback) => {
  const url = URL.baseUrl + endpoints.login;
  axiospostjson(url, loginDetails, "", callback);
};
export const signup = (signupDetail, callback) => {
  const url = URL.baseUrl + endpoints.registration;
  axiospostjson(url, signupDetail, "", callback);
};
export const bannerproduct = (signupDetail, callback) => {
  const url = URL.baseUrl + endpoints.bannerproduct;
  axiospostjson(url, signupDetail, "", callback);
};
export const productlist = (signupDetail, callback) => {
  const url = URL.baseUrl + endpoints.productlist;
  axiospostjson(url, signupDetail, "", callback);
};
export const addtocart = (signupDetail, callback) => {
  const url = URL.baseUrl + endpoints.addtocart;
  axiospostjson(url, signupDetail, "", callback);
};
export const cartitemlist = (signupDetail, callback) => {
  const url = URL.baseUrl + endpoints.cartitemlist;
  axiospostjson(url, signupDetail, "", callback);
};
export const cancelcartitem = (signupDetail, callback) => {
  const url = URL.baseUrl + endpoints.cancelcartitem;
  axiospostjson(url, signupDetail, "", callback);
};

export const alladdresslist = (signupDetail, callback) => {
  const url = URL.baseUrl + endpoints.alladdreslist;
  axiospostjson(url, signupDetail, "", callback);
};

export const addaddress = (signupDetail, callback) => {
  const url = URL.baseUrl + endpoints.addadress;
  axiospostjson(url, signupDetail, "", callback);
};

export const allorderlist = (signupDetail, callback) => {
  const url = URL.baseUrl + endpoints.allorderlist;
  axiospostjson(url, signupDetail, "", callback);
};

export const pendingorders = (signupDetail, callback) => {
  const url = URL.baseUrl + endpoints.pendingorders;
  axiospostjson(url, signupDetail, "", callback);
};
export const profiledetails = (signupDetail, callback) => {
  const url = URL.baseUrl + endpoints.profiledetails;
  axiospostjson(url, signupDetail, "", callback);
};
export const proceedtobuy = (signupDetail, callback) => {
  const url = URL.baseUrl + endpoints.proceedtobuy;
  axiospostjson(url, signupDetail, "", callback);
};

export const returnOrder = (data, callback) => {
  const url = URL.baseUrl + endpoints.return;
  axiospostjson(url, data, "", callback);
};
