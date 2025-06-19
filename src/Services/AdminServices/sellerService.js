import getUrl from "../../config";
import httpServices from "../httpServices";


export const getSellerListService = (type) => {
    return httpServices.get(`${getUrl()}/seller-list?type=${type}`)
}
export const getSellerCatalogListService = (id) => {
    return httpServices.get(`${getUrl()}/seller-catalog-list?seller_id=${id}`)
}
export const getSellerServiceListService = (id) => {
    return httpServices.get(`${getUrl()}/seller-service-list?seller_id=${id}`)
}

export const sellerProductEnableDisable = (payload) => {
    return httpServices.post(`${getUrl()}/seller-product-enable-disable`, payload);
}

export const sellerBlockUnblock = (payload) => {
    return httpServices.post(`${getUrl()}/seller-block-unblock`, payload);
}

export const getSellerDetailService = (id) => {
    return httpServices.get(`${getUrl()}/seller-data?seller_id=${id}`);
}