import getUrl from "../../config";
import httpServices from "../httpServices";


export const getCustomerListService = (offset, limit, isBlocked) => {
    return httpServices.get(`${getUrl()}/customer-list?offset=${offset}&limit=${limit}&isBlocked=${isBlocked}`);
}

export const customerBlockUnblock = (payload) => {
    return httpServices.post(`${getUrl()}/customer-block-unblock`, payload);
}