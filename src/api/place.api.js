import { api } from "./api"

export const getAll = async () => {
    const result = await api.get("/places");

    return result.data;
}

export const create = async (place) => {
    const result = await api.post("/places", place)

    return result.data;
}
