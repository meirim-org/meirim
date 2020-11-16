import axios from 'axios'
import config from '../config.json'

const instance = axios.create(config.axios)

export default {
	get: (path, data, options) => instance.get(path, { params: data }, options)
		.then(results => results.data),
	post: (path, data, options) => instance.post(path, data, options)
		.then(results => results.data),
	delete: (path, options) => instance.delete(path, options)
		.then(results => results.data),
}
