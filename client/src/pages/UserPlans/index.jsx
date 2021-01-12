import React from 'react';
import Wrapper from 'components/Wrapper';
import { useParams } from 'react-router-dom';
import { fetchUserPlans } from './controller';
import { PlanCard, Text } from 'shared';
import { Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import t from 'locale/he_IL';
import * as SC from './style';
import { StarIcon } from 'shared/icons';

const UserPlans = () => {
	const theme = useTheme();
	const { id } = useParams();
	const [plans, setPlans] = React.useState([]);

	React.useEffect( () => {
		const handler = async () => {
			const response = await fetchUserPlans(id);
			setPlans(response.data);
		};
		handler();
	}, []);

	return (
		<Wrapper>
			<div className="container">
				{plans.length > 0 
					?
					<SC.PlansContent>
						<SC.TitleWrapper>
                    		<Text
                    			size="1.5rem"
                    			weight="600"
                    			text={`${t.savedPlans} (${plans.length})`}
                    			color={theme.palette.black}
                    			component="h2"
                    		/>
                    	</SC.TitleWrapper>
                    	<Grid container spacing={4}>
                    		{plans.length && plans.map(plan => (
                    			<PlanCard key={plan.id} plan={plan}/>
                    		))}
                    	</Grid>
					</SC.PlansContent>
					:
					<SC.NoPlansContent>
						<StarIcon id="star-icon"/>
						<Text
							size="1.5rem"
							weight="700"
							text={t.noPlansSavedTitle}
							component="h1"
						/>
						<Text
							text={t.noPlansSavedContent}
							component="p"
						/>
					</SC.NoPlansContent>
				}
			</div>
		</Wrapper>
	);
};

export default UserPlans;