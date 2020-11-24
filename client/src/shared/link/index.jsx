import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLink = styled(RouterLink)`
    font-family: Assistant !important;
  font-size: 16px;
  font-weight: ${(props) => (props.bold ? '700' : '400')} ;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  text-decoration: underline;
  color: #652dd0;
  cursor: pointer;
  
  .MuiTypography-body1 {
      font-family: Assistant !important;
  }
  
    ${({ withIcon }) => withIcon  && `
    .MuiListItemIcon-root {
        margin: 0 .25rem;
        min-width: auto;
    }
    &:hover {
     color: #652dd0 !important;
    }
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #1a2d66;
        &:focus, &:hover, &:visited, &:link, &:active {
         text-decoration: none;
         color: none !important;
        }
    `}
`;

const Link = ({ id, to, text, bold, children, withIcon }) => (
	<StyledLink id={id} to={to} bold={bold} withIcon={withIcon}>{text}{children}</StyledLink>
);

Link.defaultProps = {
	bold: false,
	withIcon: false,
}

Link.propTypes = {
	to: PropTypes.string.isRequired,
	text: PropTypes.string,
	id: PropTypes.string.isRequired,
	bold: PropTypes.bool,
	children: PropTypes.object.isRequired,
	withIcon: PropTypes.bool,
};

export default Link;
