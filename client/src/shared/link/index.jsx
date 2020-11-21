import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLink = styled(RouterLink)`
  font-family: Assistant;
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
`;

const Link = ({ id, to, text, bold }) => (
	<StyledLink id={id} to={to} bold={bold}>{text}</StyledLink>
);

Link.defaultProps = {
	bold: false,
}

Link.propTypes = {
	to: PropTypes.string.isRequired,
	text: PropTypes.string,
	id: PropTypes.string.isRequired,
	bold: PropTypes.bool,
};

export default Link;
