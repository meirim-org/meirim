import React from 'react';
import * as SC from './style';
import { Link } from 'react-router-dom';
import Mapa from 'components/Mapa';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import UnsafeRender from 'components/UnsafeRender';
import { Text } from 'shared';
import styled from 'styled-components';
import BookmarkIcon from '../../assets/bookmarkIcon.svg'

const PlanCard = ({ plan }) => {
	const theme = useTheme();

	return (
		<Grid item xs={12} sm={6} md={4}>
			<SC.Card raised={true}>
				<Link
					className='card-link'
					to={`/plan/${plan.id}`}
				>
					<SC.CardActionArea>
						<SC.CardMedia title={plan.PL_NUMBER}>
							<MapTitle>
								<StatusBox>
									<StatusDot />
									<Text 
										size='14px'
										weight='600'
										text={'אישור עקרוני ב-5.4.21'}
										color={theme.palette.black}
									/>
								</StatusBox>
								<BookmarkBtn/>
							</MapTitle>
                            <MapFooter>
                                <FooterChip>
                                    <Text
                                        size='14px'
                                        weight='600'
                                        text={'תל אביב'}
                                        color={theme.palette.black}
                                    />
                                </FooterChip>
                                <FooterChip>
                                    <Text
                                        size='14px'
                                        weight='600'
                                        text={'6 דונם'}
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
							<Text
								size='1.5rem'
								weight='600'
								text={plan.plan_display_name}
								color={theme.palette.black}
								component='h2'
							/>
							<UnsafeRender
								html={
									plan.main_details_from_mavat
								}
							/>
						</SC.CardContent>
					</SC.CardActionArea>
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

const StatusBox = styled(Chip)`
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
    
    & :focus {outline: none;}
`;

const MapFooter = styled(MapTitle)`
    bottom: 0;
    z-index: 99999;
`;

const FooterChip = styled(Chip)`
    padding: 4px 9px;
`;