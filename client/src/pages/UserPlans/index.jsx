import React from 'react';
import Wrapper from 'components/Wrapper';
import { fetchUserPlans } from './controller';
import { PlanCard, Text } from 'shared';
import { Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import t from 'locale/he_IL';
import * as SC from './style';
import { StarIcon } from 'shared/icons';
import { CheckIfUserCanAccessPage } from 'hooks';

const UserPlans = () => {
	CheckIfUserCanAccessPage();
	const theme = useTheme();
	const [plans, setPlans] = React.useState([]);

	React.useEffect( () => {
		const handler = async () => {
			try {
				const response = await fetchUserPlans();
				setPlans(response.data);
			} catch (err) {
				console.error('fetch user plans failed: ', err);
			}
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