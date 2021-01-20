import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getFundingStats } from './controller';
import { setStatsData } from 'redux/funding/slice';
import { openModal } from 'redux/modal/slice';
import { successPageTransactionCompleteMessage } from './constants';

export const useStatsDataHandler = (paymentDone) => {
	const dispatch = useDispatch();

	useEffect(() => {
		getFundingStats().then((stats) => {
			dispatch(setStatsData({
				statsData: stats
			}));
		}).catch(err => {
			console.error('get funding stats failed:', err);
		});
	}, [dispatch, paymentDone]);
};

export const useSuccessCloseHandler = (paymentSuccessCb) => {
	const dispatch = useDispatch();

	const handleMessage = useCallback(event => {
		try {
			const data = JSON.parse(event.data);

			if (data.message === successPageTransactionCompleteMessage) {
				// open the thank you modal window instead of the payment one
				dispatch(openModal({ modalType: 'thankYou' }));

				// refresh funding stats
				paymentSuccessCb();
			}
		} catch (err) {
			if (err instanceof SyntaxError) {
				// this just means event.data wasn't a valid json
			} else {
				throw err;
			}
		}
	}, [dispatch, paymentSuccessCb]);

	useEffect(() => {
		window.addEventListener('message', handleMessage);

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, [handleMessage]);
};

export const useWhoWeAreAnchor = (locationHash, whoWeAreRef) => {
	useEffect(() => {
		if (locationHash === '#who-we-are') {
			// scrollIntoView isn't sufficient since the header hides some of the view
			const y = whoWeAreRef.current.getBoundingClientRect().top - 100;
			window.scrollBy({top: y, behavior: 'smooth'});
		} else {
			window.scroll({top: 0, behavior: 'smooth'});
		}
	}, [locationHash, whoWeAreRef]);
};
