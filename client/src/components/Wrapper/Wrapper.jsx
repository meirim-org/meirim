import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Navigation } from 'shared';
import * as SC from './style';
import Footer from 'components/Footer';

const Wrapper = ({ hideFooter, ...props }) => {
	const { children } = props;

	return (
		<SC.Wrapper>
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
			{!hideFooter &&
                <Footer/>
			}
		</SC.Wrapper>
	);
};

Wrapper.defaultProps = {
	hideFooter: false
};


Wrapper.propTypes = {
	children: PropTypes.any,
	hideFooter: PropTypes.bool
};

export default Wrapper;