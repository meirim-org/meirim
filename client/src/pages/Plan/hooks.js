import { useEffect, useState } from 'react';
import geojsonArea from '@mapbox/geojson-area';
import { parseNumber, scrollToTop } from 'utils';
import { setData } from 'redux/comments/slice';
import { setPlanData } from 'redux/plan/slice';
import * as utils from './utils';
import { getPlanData, getCommentsByPlanId } from './controller';
import { useDispatch } from 'react-redux';
import { fetchUserPlans } from 'pages/UserPlans/controller';
import { UserSelectors } from 'redux/selectors';

export const isFavoritePlan = async (userId, planId) => {
    const favPlans = await fetchUserPlans(userId);
    const result = favPlans.data.find(
        (p) => parseInt(p.id, 10) === parseInt(planId, 10)
    );

    return Boolean(result);
};

export const useIsFavPlan = (planId) => {
    const [isFav, setIsFav] = useState(false);
    const {
        user: { id: userId },
    } = UserSelectors();
    useEffect(() => {
        const handler = async () => {
            const result = await isFavoritePlan(userId, planId);
            setIsFav(Boolean(result));
        };
        handler();
    }, [userId, planId]);

    return isFav;
};

export const useCommentsDataHandler = (
    planId,
    refetchComments,
    setRefetchComments
) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchComments = async () => {
            const response = await getCommentsByPlanId(planId);
            const comments = utils.extractComments(response.data);
            dispatch(
                setData({
                    data: comments,
                    commentsCount: response.data.length.toString(),
                })
            );
        };
        fetchComments();
        setRefetchComments(false);
    }, [planId, refetchComments, dispatch, setRefetchComments]);
};
// export const useStatus=()=>{
//     useEffect(()=>{
//         const fetchData=async()=>{
//             const response= await stepeStatus
//         }
//     })
// }
export const useDataHandler = (planId) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            const response = await getPlanData(planId);
            const {
                PLAN_COUNTY_NAME: countyName,
                plan_display_name: name,
                PL_NAME: originalName,
                jurisdiction,
                status,
                stepStatus,
                notCredible,
                goals_from_mavat: goalsFromMavat,
                main_details_from_mavat: mainDetailsFromMavat,
                plan_url: url,
                areaChanges,
                geom,
            } = response.data;
            const {
                ENTITY_SUBTYPE_DESC: type,
                PL_NUMBER: number,
                DEPOSITING_DATE: depositingDate,
                PL_LANDUSE_STRING: landUse,
                STATION_DESC: stationDesc,
                LAST_UPDATE: lastUpdate,
            } = response.data.data;
            const newTextArea = {
                ...utils.initialTextArea,
                area: geom ? Math.round(geojsonArea.geometry(geom)) : 0,
            };
            const newDataArea = [
                {
                    label: 'זכויות קיימות',
                    data: [],
                },
                {
                    label: 'זכויות מבוקשות',
                    data: [],
                },
            ];
            const newDataUnits = [
                {
                    label: 'יחידות קיימות',
                    data: [],
                },
                {
                    label: 'יחידות מבוקשות',
                    data: [],
                },
            ];
            const changes = areaChanges ? JSON.parse(areaChanges) : null;
            if (changes) {
                changes[0].map(function (change) {
                    const isRelevantChange = change[3];
                    if (!isRelevantChange) return false;
                    const areaChangeType = utils.getAreaChangeType(change);
                    const handler = utils.areaChangeHandlers[areaChangeType];
                    const [firstChange, secondChange] = handler(change);
                    if (areaChangeType === 'meter') {
                        newDataArea[0].data.push(firstChange);
                        newDataArea[1].data.push(secondChange);
                        newTextArea.exist += parseNumber(change[5]);
                        newTextArea.new += parseNumber(change[6]);
                    } else {
                        newDataUnits[0].data.push(firstChange);
                        newDataUnits[1].data.push(secondChange);
                    }

                    return true;
                });
            }
            dispatch(
                setPlanData({
                    dataArea: newDataArea,
                    dataUnits: newDataUnits,
                    textArea: newTextArea,
                    planData: {
                        countyName,
                        name,
                        status,
                        stepStatus,
                        type,
                        number,
                        jurisdiction,
                        depositingDate,
                        landUse,
                        stationDesc,
                        notCredible,
                        lastUpdate,
                        goalsFromMavat,
                        mainDetailsFromMavat,
                        url,
                        areaChanges,
                        geom,
                        originalName,
                    },
                })
            );
        };

        fetchData();
    }, [planId, dispatch]);
};

export const useScrollToTop = () => {
    useEffect(() => scrollToTop(), []);
};
