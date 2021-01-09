import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getFundingStats } from './controller';
import { setStatsData } from 'redux/funding/slice';

export const useStatsDataHandler = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        getFundingStats().then((stats) => {
            dispatch(setStatsData({
                statsData: stats
			}));
        }).catch(err => {
            console.error('get funding stats failed:', err);
        });
    }, [dispatch]);
};
