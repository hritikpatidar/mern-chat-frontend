import { getItemLocalStorage } from "./Utils/browserServices";

const getUrl = () => {
  const userRole = getItemLocalStorage("userRole") || "Guest";
  const API_BASE_URLS = {
    Seller: "seller",
    Admin: "super-admin",
    User: "auth",
    Guest: "auth"
  };
  return API_BASE_URLS[userRole];
};

export default getUrl;
