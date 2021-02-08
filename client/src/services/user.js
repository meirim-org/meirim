import api from "./api";

export const logout = async () => {
    try {
        const response = await api.post("/sign/out");

        return response;
    } catch (err) {
        throw new err();
    }
};
