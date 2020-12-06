import api from 'services/api';
import { SuccessAddComment, FailAddComment, 
	SuccessSubscribeUserToPlan, FailSubscribeUserToPlan } from 'toasts';

export const subscribeUserToPlan = async (planId) => {
	try {
		const response = await api.post(`/plan/${planId}/subscribe`);
		const success = response.status === 'OK';
		if (success) SuccessSubscribeUserToPlan();
	} catch (err){ 
		FailSubscribeUserToPlan();
	}
};

export const addComment = async ({ content, plan_id, person_id, name }) => {
	try {	
		const data = {
			content,
			name,
			person_id,
			plan_id,
			parent_id: 0 
		};
		const response = await api.post(`/comment/${plan_id}`, { ...data });
		const success = response.status === 'OK';
		if (success) SuccessAddComment();
	} catch (err){ 
		FailAddComment();
	}
};

export const addLike = async ({ commentId }) => {
	try {
		const response = await api.post('/comment/addLike', { commentId });
		
		return response;
	} catch (err) {
		console.log('err',err);
	}
};

export const getPlanData = async (planId) => {
	try {
		await api.post(`/impression/${planId}`);
		const response = await api.get(`/plan/${planId}`);
		
		return response;
	} catch (err) {
		console.log('err',err);
	}
};