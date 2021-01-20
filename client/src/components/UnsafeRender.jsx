import React from 'react';
import PropTypes from 'prop-types';

const UnsafeRender = ({ html }) => {
	const createMarkup= (h) => {
		return { __html: h };
	};
	
	return <div dangerouslySetInnerHTML={createMarkup(html)} />;
};

UnsafeRender.propTypes ={ 
	html: PropTypes.string
};

export default UnsafeRender;
