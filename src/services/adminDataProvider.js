import { stringify } from 'query-string';
import {
    fetchUtils,
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
} from 'react-admin';

const adminDataProvider = (apiUrl, httpClient=fetchUtils.fetchJson) => {
    const convertDataRequestToHttp = (type, resource, params) => {
        let url = '';
        let options = {};

        switch(type){
            case GET_ONE:
                url = `${apiUrl}/${resource}/${params.id}/`;
                break;
            case GET_LIST: {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const { filter } = params;
                const query = {
                    page,
                    pageSize: perPage,
                    order: `${order === 'ASC' ? '' : '-'}${field}`,
                    ...filter
                };
                url = `${apiUrl}/${resource}/?${stringify(query)}`;
                break;
            }
            case GET_MANY_REFERENCE: {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const { filter, target, id } = params;
                const query = {
                    page,
                    pageSize: perPage,
                    order: `${order === 'ASC' ? '' : '-'}${field}`,
                    ...filter,
                    [target]: id
                };
                url = `${apiUrl}/${resource}/?${stringify(query)}`;
                break;
            }
            default:
                throw new Error(`Unsupported Data Provider request type ${type}`);
        }

        return { url, options };
    }

    const convertHttpResponse = (response, type, resource, params) => {
        const { headers, json } = response;

        switch (type) {
            case GET_LIST:
            case GET_MANY_REFERENCE:
                return { data: json.data, total: json.pagination.rowCount}
            default:
                return { data: json };
        }
    }

    return (type, resource, params) => {
        // split GET_MANY to separate promises
        switch (type) {
            case GET_MANY:
                return Promise.all(
                    params.ids.map(id =>
                        httpClient(`${apiUrl}/${resource}/${id}/`, {
                            method: 'GET'
                        })
                    )
                ).then(responses => ({
                    data: responses.map(response => response.json.data),
                }));
            default:
                break;
        }

        const { url, options } = convertDataRequestToHttp(type, resource, params);
        return httpClient(url, options)
            .then(response => convertHttpResponse(response, type, resource, params));
    }
}

export default adminDataProvider;
