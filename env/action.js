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

export const categorylist = (data, callback) => {
  const url = URL.baseUrl + endpoints.Categorylist;
  axiospostjson(url, data, "", callback);
} ;

export const productbycategory = (data, callback) => {
  const url = URL.baseUrl + endpoints.Productbycategory;
  axiospostjson(url, data, "", callback);
} ;         
export const productdetails = (data, callback) => {
  const url = URL.baseUrl + endpoints.Productdetails;
  axiospostjson(url, data, "", callback);
} ;         
export const similarproducts = (data, callback) => {
  const url = URL.baseUrl + endpoints.Similarproducts;
  axiospostjson(url, data, "", callback);
} ;

export const sendRegistrationOtp = (data, callback) => {
  const url = URL.baseUrl + endpoints.SendRegistrationOtp;
  axiospostjson(url, data, "", callback);
} ;

export const sendForgotPasswordOtp = (data, callback) => {
  const url = URL.baseUrl + endpoints.ForgotPasswordOtp;
  axiospostjson(url, data, "", callback);
} ;

export const resetPassword = (data, callback) => {
  const url = URL.baseUrl + endpoints.ResetPassword;
  axiospostjson(url, data, "", callback);
} ;

export const verifyRegistrationOtp = (data, callback) => {
  const url = URL.baseUrl + endpoints.VerifyRegistrationOtp;
  axiospostjson(url, data, "", callback);
} ;


