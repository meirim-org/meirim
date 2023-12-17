import { useEffect, useState } from 'react';
import { UserSelectors } from 'redux/selectors';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ReactGA from 'react-ga';
import { hotjar } from 'react-hotjar';
import { map } from 'lodash';
import { authenticated, fetchedFavoritePlans } from 'redux/user/slice';
import { closeModal } from 'redux/modal/slice';
import { HOME, ALERTS } from 'router/contants';
import api from 'services/api';
import { fetchUserPlans } from 'pages/UserPlans/controller';

export const ValidUserHook = (user) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const isHomePage = history.location.pathname === '/';
	useEffect(() => {
		if (user) {
			dispatch(authenticated({ user }));
			isHomePage && history.push(ALERTS);
			dispatch(closeModal());
		}
	}, [user, dispatch, history, isHomePage]);
};

export const CookieHook = () => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [success, setSuccess] = useState(false);
	const [response, setResponse] = useState({});
	const [error, setError] = useState({});
	useEffect(() => {
		api.get('/me')
			.then((response) => {
				const { name, id, admin } = response.me;
				setSuccess(true);
				dispatch(authenticated({ user: { name, id, admin } }));
				setLoading(false);
				setResponse(response);

				return fetchUserPlans(id).then(({ data }) => {
					const favoritePlans = map(data, 'id');
					dispatch(fetchedFavoritePlans({ favoritePlans }));
				});
			})
			.catch((err) => {
				setError(err);
				setLoading(false);
				setSuccess(false);
			});
	}, [dispatch]);

	return { success, response, error, loading };
};

export const CheckIfUserCanAccessPage = () => {
	const { isAuthenticated } = UserSelectors();
	const history = useHistory();
	useEffect(() => {
		if (!isAuthenticated) {
			history.push(HOME, 'openRegister');
		}
	}, [isAuthenticated, history]);
};

export const useInitGA = () => {
	useEffect(() => {
		if (process.env.CONFIG.analytics.ga.enabled) {
			ReactGA.initialize(process.env.CONFIG.analytics.ga.ua);
		}
	}, []);
};

export const useInitHotjar = () => {
	useEffect(() => {
		if (process.env.CONFIG.analytics.hotjar.enabled) {
			hotjar.initialize(
				process.env.CONFIG.analytics.hotjar.hjid,
				process.env.CONFIG.analytics.hotjar.hjsv
			);
		}
	}, []);
};

export const useStickyPlansHeader = () => {
	const [translateY, setTranslateY] = useState(0);
	const [hiddenTopSection, setHiddenTopSection] = useState(false);
	const [hiddenTopContentSection, setHiddenTopContentSection] =
        useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const handleScrollEvent = () => {
		if (lastScrollY > window.scrollY) {
			setHiddenTopSection(false);
			setTranslateY(-100);
		} else if (lastScrollY < window.scrollY) {
			setHiddenTopSection(true);
			setHiddenTopContentSection(true);
			setTranslateY(-200);
		}
		setLastScrollY(window.scrollY);
		if (window.scrollY === 0) {
			setHiddenTopSection(false);
			setHiddenTopContentSection(false);
			setTranslateY(0);
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScrollEvent);

		return () => {
			window.removeEventListener('scroll', handleScrollEvent);
		};
	});

	return { translateY, hiddenTopSection, hiddenTopContentSection };
};
