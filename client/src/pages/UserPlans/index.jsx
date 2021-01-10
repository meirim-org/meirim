import React from 'react';
import Wrapper from 'components/Wrapper';
import { useParams } from 'react-router-dom';
import { fetchUserPlans } from './controller';


const UserPlans = () => {
	const { id } = useParams();
	const [plans, setPlans] = React.useState([]);

	React.useEffect(async () => {
		const response = await fetchUserPlans(id);
		console.log('data length', response.data.length);
		setPlans(pv => ({ ...pv, plans: response.data }));
	}, []);

	return (
		<Wrapper>
			{JSON.stringify(plans)}
		</Wrapper>
	);
};

export default UserPlans;