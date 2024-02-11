import axios from 'axios'

const instance = axios.create({
	"baseURL": process.env.REACT_APP_BASE_API_URL,
	"withCredentials": true
})

export default {
	get: (path, data, options) => instance.get(path, { params: data }, options)
		.then(results => results.data),
	post: (path, data, options) => instance.post(path, data, options)
		.then(results => results.data),
	delete: (path, options) => instance.delete(path, options)
		.then(results => results.data),
}
