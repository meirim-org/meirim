import React, { useEffect, useState, useRef, createRef, useLayoutEffect, useCallback } from 'react';
import * as SC from './style';
import { Link } from 'react-router-dom';
import Mapa from 'components/Mapa';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import UnsafeRender from 'components/UnsafeRender';
import { Text } from 'shared';
import styled from 'styled-components';
import BookmarkIcon from '../../assets/bookmarkIcon.svg';
import DropPinIcon from '../../assets/drop-pin-icon.svg';


const mockTags = [
	{
		text: 'משרדים',
		type: 'offices'
	},
	{
		text: 'מסחר',
		type: 'commerce'
	},
	{
		text: 'שטח פתוח',
		type: 'open-field'
	},
	{
		text: 'מגורים',
		type: 'residence'
	},
	{
		text: 'תחבורה',
		type: 'transportation'
	},
	{
		text: 'מוסדות ציבור',
		type: 'public-institutes'
	},
	// {
	// 	text: 'קגדגכ'
	// },
	// {
	// 	text: 'גדכדג'
	// },
	// {
	// 	text: 'כדג'
	// },
];

const PlanCard = ({ plan }) => {
	const theme = useTheme();
	const tagsWrapperRef = useRef(null);
	const [tags, setTags] = useState(mockTags);
	const tagsRef = useRef(mockTags.map(() => createRef()));

	// const intersectionObserverCallback = (entries) => {
	// 	console.log(entries);
	// 	const visibleTags = entries.filter(entry => entry.isIntersecting);
	// 	if (visibleTags.length < entries.length){
	// 		const newTags = tags.slice(0,visibleTags.length);
	// 		newTags.push({ text: `${entries.length - visibleTags.length + 1}`, type: 'plus' });
	// 		setTags(newTags);
	// 	}
	// };

	const intersectionObserverCallback = useCallback((entries) => {
        console.log(entries);
        const visibleTags = entries.filter(entry => entry.isIntersecting);
        if (visibleTags.length < entries.length){
            const newTags = tags.slice(0,visibleTags.length);
            newTags.push({ text: `${entries.length - visibleTags.length + 1}`, type: 'plus' });
            setTags(newTags);
        }
    },[tags])

	useLayoutEffect(() => {
	    const currentTagsRef = tagsRef.current;
		const observer = new IntersectionObserver(intersectionObserverCallback, {
			root: tagsWrapperRef.current,
			rootMargin: '0px',
			threshold: 0
		});

		if (currentTagsRef){
			currentTagsRef.forEach(ref => {
				observer.observe(ref.current);
			});
		}

		return () => {
			if (currentTagsRef) {
				currentTagsRef.forEach(ref => {
					ref.current && observer.unobserve(ref.current);
				});
			}
		};
	}, [tagsRef]);
    
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
								<StatusDot approved={plan.status === 'מאושרות'} />
								<Text
									size='14px'
									weight='600'
									text={`${plan.status} ב-5.4.21`}
									color={theme.palette.black}
								/>
							</StatusChip>
							<BookmarkBtn />
						</MapTitle>
						<MapFooter>
							<FooterChip>
								<Text
									size='14px'
									weight='600'
									text={plan.PLAN_COUNTY_NAME}
									color={theme.palette.black}
								/>
							</FooterChip>
							<FooterChip>
								<Text
									size='14px'
									weight='600'
									text={`${Math.round(plan?.data?.PL_AREA_DUNAM)} דונם`}
									color={theme.palette.black}
								/>
							</FooterChip>
						</MapFooter>
						<Mapa
							geom={plan.geom}
							countyName={plan.PLAN_COUNTY_NAME}
							hideZoom={true}
							disableInteractions={true}
							title2={plan.distance ? ` ${Math.ceil(plan.distance / 5) * 5} מ׳ מהכתובת` : ''}
						/>
					</SC.CardMedia>
					<SC.CardContent>
                        {plan?.data?.QUANTITY_DELTA_120 > 0 || plan.distance ? <PlanDetailsHeader>
                            {plan.distance && <PlanDistance showDivider={plan?.data?.QUANTITY_DELTA_120 > 0}>
                                <Text
                                    size='16px'
                                    weight='600'
                                    text={` ${Math.ceil(plan.distance / 5) * 5} מ׳ מהכתובת`}
                                    color={theme.palette.black}
                                />
                            </PlanDistance>}
                            {plan?.data?.QUANTITY_DELTA_120 > 0 ? <Text
                                size='16px'
                                weight='600'
                                text={`${plan?.data?.QUANTITY_DELTA_120}+ דירות`}
                                color={theme.palette.black}
                            /> : null}
                        </PlanDetailsHeader> : null}
						<PlanName>
							<Text
								size='18px'
								weight='normal'
								text={plan?.plan_display_name}
								color={theme.palette.black}
							/>
						</PlanName>
						<Tags ref={tagsWrapperRef}>
							{tags.map((tag, i) => {
								let tagIconUrl = null;
								try {
									tagIconUrl = require(`../../assets/${tag.type}-tag-icon.svg`);
								} catch (e){
								    console.log(`${tag.type}-tag-icon.svg does not exist`);
								}

								return <Tag key={i} ref={tagsRef.current[i]}>
									{tagIconUrl && <TagIcon src={tagIconUrl} />}
									<Text
										size='16px'
										weight='normal'
										text={tag.text}
										color={theme.palette.black}
									/>
								</Tag>;
							})}
						</Tags>
						{/*<Text*/}
						{/*	size='1.5rem'*/}
						{/*	weight='600'*/}
						{/*	text={plan.plan_display_name}*/}
						{/*	color={theme.palette.black}*/}
						{/*	component='h2'*/}
						{/*/>*/}
						{/*<UnsafeRender*/}
						{/*	html={*/}
						{/*		plan.main_details_from_mavat*/}
						{/*	}*/}
						{/*/>*/}
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
`;

const StatusDot = styled.div`
    width: 14px;
    height: 14px;
    margin-left: 7px;
    border-radius: 7px;
    background: ${({ approved }) => approved ? '#1976D2' : '#AE7FF0'};
`;

const BookmarkBtn = styled.button`
    width: 37px;
    height: 37px;
    border: none;
    border-radius: 18.5px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    background: center no-repeat url(${BookmarkIcon}) #FFFFFF;

    & :focus {
        outline: none;
    }
`;

const MapFooter = styled(MapTitle)`
    bottom: 0;
    z-index: 99999;
`;

const FooterChip = styled(Chip)`
    padding: 4px 9px;
`;

const PlanDetailsHeader = styled.div`
    display: flex;
    flex-flow: row;
    align-items: center;
    height: 36px;
    flex-shrink: 0;
`;

const PlanDistance = styled.div`
    display: flex;
    align-items: center;

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
`;

const PlanName = styled.div`
    flex-shrink: 0;
    height: 50px;
    overflow: hidden;
  margin-bottom: 27px;
`;

const Tags = styled.div`
    display: flex;
    align-items: center;
    flex-flow: wrap;
    overflow: hidden;
`;

const Tag = styled.div`
    display: flex;
    align-items: center;
    height: 26.35px;
    background: #F5F5F5;
    border-radius: 4px;
    padding: 0 8px;
    margin: 0 0 10px 10px;
    
    ${({ type }) => type && `
      &:before {
        width: 20px;
        height: 20px;
        // content: url(${require('../../assets/'+type+'-tag-icon.svg')});
      }
    `}
`;

const TagIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-left: 8px;
`;