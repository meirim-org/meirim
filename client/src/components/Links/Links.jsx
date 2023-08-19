import React from 'react';
import { LinksWrapper } from './style';
import LinkItem from './LinkItem';
import PropTypes from 'prop-types';

const Links = ({ columns, links }) => {
	if (!links) {
		return null;
	}

	return (
		<LinksWrapper columns={columns}>
			{links &&
                links.map((item) => (
                	<LinkItem
                		key={item.id}
                		type={item.link_type}
                		title={item.link_title}
                		description={item.link_description}
                		link={item.url}
                		actionText={item.actionText}
                		color={item.color}
                	/>
                ))}
		</LinksWrapper>
	);
};

Links.propTypes = {
	columns: PropTypes.number,
	links: PropTypes.array,
};

export default Links;
