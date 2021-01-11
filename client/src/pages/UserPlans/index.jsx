import React from 'react';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import CardMedia from '@material-ui/core/CardMedia';
import InfiniteScroll from 'react-infinite-scroll-component';
import Wrapper from 'components/Wrapper';
import UnsafeRender from 'components/UnsafeRender';
import Mapa from 'components/Mapa';
import { useParams } from 'react-router-dom';
import { fetchUserPlans } from './controller';


const UserPlans = () => {
	const { id } = useParams();
	const [plans, setPlans] = React.useState([]);

	React.useEffect(async () => {
		const response = await fetchUserPlans(id);
		console.log('data length', response.data);
		setPlans(response.data);
	}, []);

	console.log('plans', plans);
	
	return (
		<Wrapper>
			<div className="container">
				<GridList
					cellHeight={500}
					cellWidth={335}
					className="gridList"
					cols={1}
				>
					{plans.length && plans.map(plan => (
						<Card className="card" raised={true} key={plan.id}>
							<Link
								className="card-link"
								to={`/plan/${plan.id}`}
							>
								<CardActionArea className="card-action-area">
									<CardMedia
										className="card-media"
										title={plan.PL_NUMBER}
									>
										<Mapa
											geom={plan.geom}
											hideZoom={true}
											disableInteractions={true}
											title={plan.PLAN_COUNTY_NAME}
											title2={plan.distance?` ${Math.ceil(plan.distance/5)*5} מ׳ מהכתובת`:'' }
										/>
									</CardMedia>
									<CardContent className="card-content">
										<Typography
											gutterBottom
											variant="h5"
											component="h2"
											color="textPrimary"
										>
											{plan.PL_NAME}
										</Typography>
										<Typography component="p" color="textPrimary">
											<UnsafeRender
												html={
													plan.main_details_from_mavat
												}
											/>
										</Typography>
									</CardContent>
								</CardActionArea>
							</Link>
						</Card>
					))}
				</GridList>
			</div>
		</Wrapper>
	);
};

export default UserPlans;