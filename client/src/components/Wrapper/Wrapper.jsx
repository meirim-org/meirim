import React, { Fragment } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import Navigation from '../Navigation';
import Footer from '../Footer';

export default function Wrapper(props) {
	const { me, children } = props;

	return (
		<Fragment>
			<Navigation me={me} />
			{!children ? (
				<div style={{ textAlign: 'center' }}>
					<CircularProgress />
				</div>
			) : (
				props.children
			)}
			<Footer />
		</Fragment>
	);
}
