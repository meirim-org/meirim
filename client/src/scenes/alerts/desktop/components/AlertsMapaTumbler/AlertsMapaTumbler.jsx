import React, { useEffect, useRef } from 'react';
import * as SC from './style';
import { Checkbox } from 'shared';
import { DomEvent } from 'leaflet';

const AlertsMapaTumbler = ({ tumbler: { plans, trees }, tumblerHandler }) => {

	const tumblerRef = useRef(null);

	useEffect(() => {
		const tumblerRefElement = tumblerRef.current;
		let handleDoubleClick = () => {};

		if (tumblerRefElement) {
			handleDoubleClick = (e) => {
				DomEvent.stopPropagation(e);
			};
		}

		tumblerRefElement.addEventListener('dblclick', handleDoubleClick);

		return () => {
			tumblerRefElement.removeEventListener(
				'dblclick',
				handleDoubleClick
			);
		};
	}, []);

	return (
		<SC.Tumbler ref={tumblerRef}>
			<SC.Label>
				<Checkbox
					text=""
					onClick={tumblerHandler}
					id="plans"
					checked={plans}
				/>
				<span className="circle circle_blue"></span>
				<SC.InputName>תוכניות בנייה</SC.InputName>
			</SC.Label>

			<SC.Label>
				<Checkbox
					text=""
					onClick={tumblerHandler}
					id="trees"
					checked={trees}
				/>
				<span className="circle circle_green"></span>
				<SC.InputName>רישיונות כריתה של עצים</SC.InputName>
			</SC.Label>
		</SC.Tumbler>
	);
};

export default AlertsMapaTumbler;
