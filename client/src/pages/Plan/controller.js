import api from 'services/api'
import { SuccessSubscribeUserToPlan, FailSubscribeUserToPlan } from 'toasts'

export const subscribeUserToPlan = async (planId) => {
	try {
		const response = await api.post(`/plan/${planId}/subscribe`)
		const success = response.status === 'OK'
		if (success) SuccessSubscribeUserToPlan()
	} catch (err){ 
		FailSubscribeUserToPlan()
	}
}
