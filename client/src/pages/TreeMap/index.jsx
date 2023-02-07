import React from 'react';
import PropTypes from 'prop-types';
import { withGetScreen } from 'react-getscreen';
import Wrapper from "../../components/Wrapper";
import {Map} from "../../components/Map/map";

const TreeMap = ({ isMobile, geojson }) => {
    if (isMobile()) {return null}

	return (
		<>
            <Map geojson={geojson}/>
		</>
	);
};

TreeMap.propTypes = {
	isMobile: PropTypes.func.isRequired,
    geojson: PropTypes.object.isRequired,
};

export default withGetScreen(TreeMap, { mobileLimit: 768, tabletLimit: 1024, shouldListenOnResize: true });
