import axios from 'axios';

const instance = axios.create(process.env.CONFIG.axios)
// TESTING PURPOSE
// const instance = axios.create({
//     baseURL: 'https://a910-119-82-86-231.in.ngrok.io',
// });

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
