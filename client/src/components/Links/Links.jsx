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
                        type={item.type}
                        title={item.title}
                        description={item.description}
                        link={item.link}
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
