import React from 'react';
import PropTypes from 'prop-types';
import DesktopNavBar from './desktop'

const Navigation = ({ me }) => {
	return (
		<DesktopNavBar me={me}/>
	);

}

Navigation.propTypes = {
	me: PropTypes.bool,
};


export default Navigation;
