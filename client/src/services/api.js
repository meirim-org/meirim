import axios from 'axios';

const instance = axios.create(process.env.CONFIG.axios)

export default {
    get: (path, data, options) =>
        instance
            .get(path, { params: data }, options)
            .then((results) => results.data),
    post: (path, data, options) =>
        instance.post(path, data, options).then((results) => results.data),
    delete: (path, options) =>
        instance.delete(path, options).then((results) => results.data),
};
