import { useEffect, useState } from 'react';
import { UserSelectors } from 'redux/selectors'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authenticated } from 'redux/user/slice' 
import { closeModal } from 'redux/modal/slice' 
import { HOME, ALERTS } from 'router/contants'
import api from 'services/api';

export const ValidUserHook = (user) => {
	const dispatch = useDispatch()
	const history = useHistory()
	useEffect(() => {
		if (user){
			dispatch(authenticated({ user }))
			history.push(ALERTS)
			dispatch(closeModal())
		}
	},[user])
}

export const CookieHook = () => {
	const dispatch = useDispatch()
	const [ loading, setLoading ] = useState(true)
	const [ success, setSuccess ] = useState(false)
	const [ response, setResponse ] = useState({})
	const [ error, setError ] = useState({})
	useEffect(() => {
		api.get('/me').then((response) => {
			setSuccess(true)
			dispatch(authenticated({ user: { name: 'me' } }))
			setLoading(false)
			setResponse(response)
		}).catch((err) => {
			setError(err)
			setLoading(false)
			setSuccess(false)
		})

	}, [])
	
	return { success, response , error, loading }
}

export const CheckIfUserCanAccessPage = () => {
	const { isAuthenticated } = UserSelectors()
	const history = useHistory()
	useEffect(() => {
		if (!isAuthenticated) {
			history.push(HOME, 'openRegister')
		}
	}, [isAuthenticated])
}