import api from "../../services/api";

export const loginUser = async ({ values }) => {
    try {
        const response = await api.post("/sign/in", values);

        return response;
    } catch (err) {
        return err;
    }
};
