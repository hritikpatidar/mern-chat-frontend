import getUrl from "../../config";
import httpServices from "../httpServices";

export const getUserListService = (role) => {
    return httpServices.get(`${getUrl()}/user-list?role=${role}`);
}

export const uploadFileService = (payload) => {
    return httpServices.post(`/user/upload-img`, payload);
};

export const getDownloadBufferFile = (payload) => {
    return httpServices.post(`/user/download-file`, payload);
}

export const createConversationService = (payload) => {
    return httpServices.post(`${getUrl()}/create-conversation`, payload);
}

export const getConversationService = () => {
    return httpServices.get(`${getUrl()}/get-conversations`);
}