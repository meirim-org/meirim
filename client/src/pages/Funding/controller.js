import api from "../../services/paymentApi";

export const createPaymentLink = async (options) => {
    //const requestData = { email };
    try {
        const response = await api.getPaymentURL({ ...options });
        return response;
    } catch (err) {
        throw new Error(err);
    }
};

export const getFundingStats = async (options) => {
    try {
        const response = await api.getFundingStats({ ...options });
        return response;
    } catch (err) {
        throw new Error(err);
    }
};

export const saveTransaction = async (options) => {
    try {
        const response = await api.saveTransaction({ ...options });
        return response;
    } catch (err) {
        throw new Error(err);
    }
};
