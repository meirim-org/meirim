import React from 'react';
import * as SC from './style';
import { Link } from 'react-router-dom';
import Mapa from 'components/Mapa';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import UnsafeRender from 'components/UnsafeRender';
import { Text } from 'shared';

const PlanCard = ({ plan }) => {
	const theme = useTheme();

	return (
		<Grid item xs={12} sm={6} md={4}>
			<SC.Card raised={true}>
				<Link
					className="card-link"
					to={`/plan/${plan.id}`}
				>
					<SC.CardActionArea>
						<SC.CardMedia title={plan.PL_NUMBER}>
							<Mapa
								geom={plan.geom}
								countyName={plan.PLAN_COUNTY_NAME}
								hideZoom={true}
								disableInteractions={true}
								title2={plan.distance?` ${Math.ceil(plan.distance/5)*5} מ׳ מהכתובת`:'' }
							/>
						</SC.CardMedia>
						<SC.CardContent>
							<Text
								size="1.5rem"
								weight="600"
								text={plan.PL_NAME}
								color={theme.palette.black}
								component="h2"
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