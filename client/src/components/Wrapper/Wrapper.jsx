import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Navigation } from 'shared';
import * as SC from './style';
import { useHistory } from 'react-router-dom';
import Footer from 'components/Footer';

const Wrapper = ({hideFooter, ...props}) => {
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
            {!hideFooter &&
                <Footer/>
            }
		</Fragment>
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