import getUrl from "../../config";
import httpServices from "../httpServices";

export const getSellerInquiryService = ({ userType, offset, limit }) => {
  return httpServices.get(`${getUrl()}/inquiry-list?userType=${userType}&offset=${offset}&limit=${limit}`);
};
