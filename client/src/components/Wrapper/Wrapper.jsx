import React, {useRef, useEffect, useState, cloneElement} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import Navigation from '../Navigation';
import Footer from '../Footer';

export default function Wrapper(props) {
	const {me, children, fullPage} = props;
	const parentRef = useRef(null);
	const [navHeight, setNavHeight] = useState(0);

	useEffect(() => {
		if (parentRef.current && fullPage) {
			setTimeout(() => setNavHeight(parentRef.current.clientHeight), 1);
		}
	}, [fullPage]);

	const renderChildren = () => {
		if (!children) {
			return <div style={{textAlign: 'center'}}>
				<CircularProgress/>
			</div>
		} else {
			if (navHeight) {
				return cloneElement(children, {navHeight})
			}
		}
		
		return children
	}

	return (
		<>
			<div ref={parentRef}>
				<Navigation me={me}/>
			</div>
			{renderChildren()}
			<Footer/>
		</>
	);
}
