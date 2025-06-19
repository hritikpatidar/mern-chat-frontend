import getUrl from "../../config"
import httpServices from "../httpServices"

export const getOrderLogService =({order_status,offset,limit,userId,userType})=>{
    return httpServices.get(`${getUrl()}/order-list?order_status=${order_status}&offset=${offset}&limit=${limit}&userId=${userId}&userType=${userType}`)
}