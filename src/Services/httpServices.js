import axiosInstance from "./axios"

const httpServices = {
    async get(endpoint) {
        const response = await axiosInstance.get(
            `${endpoint}`,
        );
        return response;
    },

    async post(endpoint, data) {
        const response = await axiosInstance.post(
            `${endpoint}`,
            data
        );
        return response;
    },

    async put(endpoint, data) {
        const response = await axiosInstance.put(
            `${endpoint}`,
            data
        );
        return response;
    },

    async patch(endpoint, data) {
        const response = await axiosInstance.patch(
            `${endpoint}`,
            data,
        );
        return response;
    },

    async delete(endpoint) {
        const response = await axiosInstance.delete(
            `${endpoint}`,
        );
        return response;
    }

};

export default httpServices


