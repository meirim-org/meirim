import leaflet from 'leaflet';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Wrapper from 'components/Wrapper';
import { Header } from './containers';
import Footer from 'components/Footer';
import * as SC from './style';
import AlertsMapa from './components/AlertsMapa';

const Template = ({ children, match, alerts }) => {
	const [bounds, setBounds] = useState([
		{ lat: 35, lng: 35 },
		{ lat: 25, lng: 25 },
	]);

	const [activeAlerts, setActiveAlerts] = useState([]);

	useEffect(() => {
		setActiveAlerts([...alerts.filter((alert) => !alert.disabled)]);

		let transparentLayer = leaflet.geoJSON();
		if (activeAlerts.length > 0) {
			activeAlerts.map((alert) =>
				leaflet.geoJSON(alert.geom).addTo(transparentLayer)
			);
			const layerBounds = transparentLayer.getBounds();
			setBounds([layerBounds._southWest, layerBounds._northEast]);
		}
	}, [alerts]);

	return (
		<Wrapper hideFooter={true}>
			<SC.MainWrapper>
				<SC.Content>
					<Header match={match} alerts={alerts} />
					<SC.Main>{children}</SC.Main>
					<Footer />
				</SC.Content>
				<AlertsMapa alerts={activeAlerts} bounds={bounds} />
			</SC.MainWrapper>
		</Wrapper>
	);
};

Template.propTypes = {
	alerts: PropTypes.array.isRequired,
	children: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
};

export default Template;
