import api from 'services/api';

export const getTreeData = async (treeId) => {
	try {
		// TODO: add other object types to impressions and re-enable this
		// await api.post(`/impression/${planId}`);
		const response = await api.get(`/tree/${treeId}`);
		
		return response;
	} catch (err) {
		console.log('err',err);
	}
};