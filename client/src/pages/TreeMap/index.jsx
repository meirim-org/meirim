import React from 'react';
import PropTypes from 'prop-types';
import { withGetScreen } from 'react-getscreen';
import Wrapper from "../../components/Wrapper";
import {Map} from "../../components/Map/map";

const TreeMap = ({ isMobile, isTablet, match, geojson }) => {

    if (isMobile()) {return null}

	return (
		<>
            <h2>Rendered</h2>
            <Map geojson={geojson}/>
		</>
	);
};

TreeMap.propTypes = {
	isMobile: PropTypes.func.isRequired,
	isTablet: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
    geojson: PropTypes.object.isRequired,
};

export default withGetScreen(TreeMap, { mobileLimit: 768, tabletLimit: 1024, shouldListenOnResize: true });
