import React, { useRef, createRef, useLayoutEffect, useCallback, useState } from 'react';
import * as SC from './style';
import { Link } from 'react-router-dom';
import Mapa from 'components/Mapa';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import {withTheme} from '@material-ui/core/styles';
import moment from 'moment'
import styled from 'styled-components';
import {
    BookmarkOutlinedIcon,
    BookmarkFilledIcon,
    DropPinIcon,
} from '../../assets/icons';
import Tag from '../tag';
import { openModal } from '../../redux/modal/slice';
import { useFavoritePlan } from '../../pages/Plan/hooks';
import { UserSelectors } from '../../redux/selectors';
import { useDispatch } from 'react-redux';

const formatNumber = (number, maximumSignificantDigits = 2) => new Intl.NumberFormat('he-IL', { maximumSignificantDigits }).format(number);

const PlanCard = ({ plan }) => {
	const tagsWrapperRef = useRef(null);
    const [tags, setTags] = useState(plan?.tags || []);
    const { isSubscribed, subscribe, unsubscribe }  = useFavoritePlan(plan.id);
	const tagsRef = useRef([...(plan?.tags || []).map(() => createRef()), createRef()]);
    const dispatch = useDispatch();
    const { isAuthenticated } = UserSelectors();
    const areaInDunam = plan?.data?.PL_AREA_DUNAM ? formatNumber(plan?.data?.PL_AREA_DUNAM) : 0;
    const housingUnitAddition = plan?.data?.QUANTITY_DELTA_120 > 0 ? formatNumber(plan?.data?.QUANTITY_DELTA_120, 1) : 0;

	const intersectionObserverCallback = useCallback((entries) => {
        const visibleTags = entries.filter(entry => entry.isIntersecting);
        const newTags = [...plan?.tags];

        if(entries.length !== plan?.tags?.length){
            return
        }

        if (visibleTags.length < entries.length){
            newTags.splice(visibleTags.length-1,0, { text: `${entries.length - visibleTags.length+1}`, type: 'plus' })
            setTags(newTags);
        }
    },[plan])

	useLayoutEffect(() => {
	    const currentTagsRef = tagsRef.current;
		const observer = new IntersectionObserver(intersectionObserverCallback, {
			root: tagsWrapperRef.current,
			rootMargin: '0px',
			threshold: 0
		});

		if (currentTagsRef){
			currentTagsRef.forEach(ref => {
                ref.current && observer.observe(ref.current);
			});
		}

		return () => {
			if (currentTagsRef) {
				currentTagsRef.forEach(ref => {
					ref.current && observer.unobserve(ref.current);
				});
			}
		};
	}, [intersectionObserverCallback]);

    const subscriptionHandler = async () => {
        if (!isAuthenticated) return dispatch(openModal({ modalType: 'login' }));
        // const isFav = await isFavoritePlan(user.id, plan.id);
        if (!isSubscribed) {
            await subscribe();
        } else {
            await unsubscribe();
        }
    };

	function handleBookmarkClick(e){
	    e.preventDefault()
        subscriptionHandler()
    }

	function parseUpdateDate(){
	    if(plan.updated_at && moment(plan.updated_at).isValid()){
	        return `ב-${moment(plan.updated_at).format("DD.MM.YYYY")}`
        }
	    return ''
    }

    const getDistanceText = (distance) => {
        const roundDistance = Math.ceil(distance / 5) * 5;
        if(distance < 1000 ) return  `${formatNumber(roundDistance)} מ׳ מהכתובת`;
        return `${formatNumber(roundDistance/1000)} ק״מ מהכתובת`;
    }

	return (
		<Grid item xs={12} sm={6} md={4}>
			<SC.Card raised={true}>
				<Link
					className='card-link'
					to={`/plan/${plan.id}`}
				>
					<SC.CardMedia title={plan.PL_NUMBER}>
						<MapTitle>
                            <StatusChip>
                                <StatusDot approved={plan.status === 'מאושרות'}/>
                                <ChipText>
                                    {`${plan.status ?? ''} ${parseUpdateDate()}`}
                                </ChipText> 
                            </StatusChip>
							<BookmarkBtn isBookmarked={isSubscribed} onClick={handleBookmarkClick}/>
						</MapTitle>
						<MapFooter>
							<FooterChip>
                                <ChipText>
                                    {plan.PLAN_COUNTY_NAME}
                                </ChipText>
							</FooterChip>
                            {areaInDunam > 0 ? <FooterChip>
                                <ChipText>
                                    {`${areaInDunam} דונם`}
                                </ChipText>
                            </FooterChip> : <div />}
						</MapFooter>
						<Mapa
							geom={plan.geom}
							countyName={plan.PLAN_COUNTY_NAME}
							hideZoom={true}
							disableInteractions={true}
							title2={plan.distance ? getDistanceText(plan.distance) : ''}
						/>
					</SC.CardMedia>
					<SC.CardContent>
                        <PlanDetailsHeader>
                            {plan.distance > 0 && <PlanDistance showDivider={plan?.data?.QUANTITY_DELTA_120 > 0}>
                                {getDistanceText(plan.distance)}
                            </PlanDistance>}
                            {housingUnitAddition > 0 && <span>{`${housingUnitAddition}+ דירות`}</span>}
                        </PlanDetailsHeader>
						<PlanName>
                            {plan?.plan_display_name}
						</PlanName>
                        { plan?.goals_from_mavat && <PlanGoals>
                            {plan?.goals_from_mavat.replace(/<\/?[^>]+(>|$)/g, "")}
                        </PlanGoals> }
						{tags.length > 0 && <Tags ref={tagsWrapperRef}>
							{tags.map((tag, i) => {
								return <Tag type={tag} />
							})}
						</Tags>}
					</SC.CardContent>
				</Link>
			</SC.Card>
		</Grid>
	);
};


PlanCard.propTypes = {
	plan: PropTypes.object.isRequired,
};

export default PlanCard;

const MapTitle = styled.div`
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    z-index: 9999;
    padding: 13px 15px;
`;

const Chip = styled.div`
    display: flex;
    align-items: center;
    background: #FFFFFF;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    padding: 4px 9px;
`;

const StatusChip = styled(Chip)`
    padding: 4px 7px;
    visibility: hidden;
`;

const ChipText = withTheme(styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.palette.black};
`);

const StatusDot = styled.div`
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    margin-left: 7px;
    border-radius: 7px;
    background: ${({ approved }) => approved ? '#1976D2' : '#AE7FF0'};
`;

const BookmarkBtn = styled.button`
    width: 37px;
    height: 37px;
    border: none;
    border-radius: 18.5px;
    cursor: pointer;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    background: center no-repeat url(${({isBookmarked}) => isBookmarked ? BookmarkFilledIcon : BookmarkOutlinedIcon}) #FFFFFF;
    flex-shrink: 0;

    & :focus {
        outline: none;
        background-color: #F5F5F5;
    }
`;

const MapFooter = styled(MapTitle)`
    bottom: 0;
    z-index: 99999;
`;

const FooterChip = styled(Chip)`
    padding: 4px 9px;
`;

const PlanDetailsHeader = withTheme(styled.div`
    display: flex;
    flex-flow: row;
    align-items: center;
    height: 36px;
    flex-shrink: 0;
    span {
        font-size: 16px;
        color: ${props => props.theme.palette.black};
    }
`);

const PlanGoals = withTheme(styled.div`
    max-height: 70px;
    flex-flow: row;
    align-items: center;
    flex-shrink: 0;
    text-overflow: ellipsis;
    color: ${props => props.theme.palette.black};
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    top: 77px;
    span {
        font-size: 16px;
        color: ${props => props.theme.palette.black};
    }
`);

const PlanDistance = withTheme(styled.div`
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.palette.black};

    &:before {
        margin-left: 14px;
        content: url(${DropPinIcon});
    }

    ${({ showDivider }) => showDivider && `
      &:after {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: black;
        content: ' ';
        margin: 10px;
      }
    `}
`);

const PlanName = withTheme(styled.div`
    flex-shrink: 0;
    max-height: 50px;
    overflow: hidden;
    font-weight: 600;
    font-size: 18px;
    color: ${props => props.theme.palette.black};
`);

const Tags = styled.div`
    display: flex;
    align-items: center;
    flex-flow: wrap;
    overflow: hidden;
    position: absolute;
    bottom: 5px;
`;