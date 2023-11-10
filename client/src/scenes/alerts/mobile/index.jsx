import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import Wrapper from 'components/Wrapper';
import { Header } from './containers';
import * as SC from './style';
import Footer from 'components/Footer';
import Mapa from './components/AlertsMapa';
import leaflet from 'leaflet';

const Template = ({ children, match, alerts }) => {
    const [bounds, setBounds] = useState([
        { lat: 35, lng: 35 },
        { lat: 25, lng: 25 },
    ]);

    useEffect(() => {
        let transparentLayer = leaflet.geoJSON();
        if (alerts.length > 0) {
            alerts.map((alert) =>
                leaflet.geoJSON(alert.geom).addTo(transparentLayer)
            );
            const layerBounds = transparentLayer.getBounds();
            setBounds([layerBounds._southWest, layerBounds._northEast]);
        }
    }, [alerts]);

    const [tabsPanelRef, setTabsPanelRef] = useState(null);
    const [fixedHeader, setFixedHeader] = useState(false);

    let tabsPanelTop =
        tabsPanelRef && tabsPanelRef.current
            ? tabsPanelRef.current.getBoundingClientRect().top
            : null;

    const handleTabsPanelRef = (ref) => setTabsPanelRef(ref);
    const handleFixedHeader = (newValue) => setFixedHeader(newValue);

    useScrollPosition(
        ({ currPos }) => {
            if (currPos.y < -Math.abs(tabsPanelTop))
                return handleFixedHeader(true);

            return handleFixedHeader(false);
        },
        [tabsPanelRef]
    );

    return (
        <Wrapper hideFooter={true}>
            <SC.MobileMainWrapper>
                <SC.MapaWrapper>
                    <Mapa alerts={alerts} bounds={bounds} />
                </SC.MapaWrapper>

                <SC.Content>
                    <Header
                        match={match}
                        alerts={alerts}
                        fixedHeader={fixedHeader}
                        handleTabsPanelRef={handleTabsPanelRef}
                    />
                    <SC.Main>{children}</SC.Main>
                    <Footer />
                </SC.Content>
            </SC.MobileMainWrapper>
        </Wrapper>
    );
};

Template.propTypes = {
    alerts: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default Template;
