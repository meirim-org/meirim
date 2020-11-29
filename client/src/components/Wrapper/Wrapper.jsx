import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Navigation } from 'shared';
import Footer from '../Footer';

const Wrapper = (props) => {
	const { children } = props;

	return (
		<Fragment>
			<Navigation />
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

Wrapper.propTypes = {
	children: PropTypes.object
}

export default Wrapper