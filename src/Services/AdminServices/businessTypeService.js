import getUrl from "../../config";
import httpServices from "../httpServices";


export const addBusinnessTypeService = (payload) => {
    return httpServices.post(`${getUrl()}/add-business-type`, payload)
}

export const getBusinessListService = (offset, limit) => {
    return httpServices.get(`${getUrl()}/business-type-list?offset=${offset}&limit=${limit}`)
}

export const getBusinessTypeUserListService = (offset, limit,code) => {
    return httpServices.get(`${getUrl()}/business-type-User-list?offset=${offset}&limit=${limit}&code=${code}`)
}
