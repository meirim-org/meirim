import api from 'services/api';

export const getTreeData = async (treeId) => {
	try {
		// await api.post(`/impression/${planId}`);
		const response = await api.get(`/tree/${treeId}`);
		
		return response;
	} catch (err) {
		console.log('err',err);
	}
};