import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getFundingStats } from './controller';
import { setStatsData } from 'redux/funding/slice';
import { closeModal } from 'redux/modal/slice';
import { successPageCloseMessage } from './constants';

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
    }, [paymentDone]);
};

export const useSuccessCloseHandler = (paymentSuccessCb) => {
    const dispatch = useDispatch();

    const handleMessage = useCallback(event => {
		const data = JSON.parse(event.data);

		if (data.message === successPageCloseMessage) {
			// closing the modal, as the success page alerted user pressed close
			dispatch(closeModal())

			// refresh funding stats
			paymentSuccessCb();
		}
	});

	useEffect(() => {
		window.addEventListener('message', handleMessage);

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, [handleMessage]);
};
