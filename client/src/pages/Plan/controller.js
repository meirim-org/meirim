import api from 'services/api';
import { SuccessAddComment, FailAddComment, 
	SuccessSubscribeUserToPlan, SuccessUnsubscribeUserToPlan, FailSubscribeUserToPlan } from 'toasts';

export const unsubscribeUserToPlan = async (planId) => {
	try {
		const response = await api.delete(`/plan/${planId}/subscribe`);
		const success = response.status === 'OK';
		if (success) SuccessUnsubscribeUserToPlan();
	} catch (err){ 
		FailSubscribeUserToPlan();
	}
};

export const subscribeUserToPlan = async (planId) => {
	try {
		const response = await api.post(`/plan/${planId}/subscribe`);
		const success = response.status === 'OK';
		if (success) SuccessSubscribeUserToPlan();
	} catch (err){ 
		FailSubscribeUserToPlan();
	}
};

export const addComment = async ({ content, planId, userId,  username, parentId, type }) => {
	try {	
		const data = {
			content,
			name: username,
			person_id: userId,
			plan_id: planId,
			parent_id:  parentId,
			type
		};
		const response = await api.post(`/comment/${planId}`, { ...data });
		const success = response.status === 'OK';
		if (success) SuccessAddComment();
	} catch (err){ 
		FailAddComment();
	}
};

export const addLike = async ({ commentId }) => {
	try {
		const response = await api.post('/comment/like/add', { commentId });
		
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

export const getCommentsByPlanId = async (planId) => {
	try {	
		const response = await api.get(`/comment/${planId}`);
		
		return response;
	} catch (err){ 
		console.log('err',err);
	}
};
