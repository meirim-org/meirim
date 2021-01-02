import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Navigation } from 'shared';
import * as SC from './style';


const Wrapper = (props) => {
	const { children } = props;

	return (
		<Fragment>
			<Navigation/>
			{!children ? (
				<div style={{ textAlign: 'center' }}>
					<CircularProgress/>
				</div>
			) : (
				<SC.ChildrenWrapper>
					{props.children}
				</SC.ChildrenWrapper>
			)}
		</Fragment>
	);
};

Wrapper.propTypes = {
	children: PropTypes.any
};

export default Wrapper;