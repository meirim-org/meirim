import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLink = styled(RouterLink)`
  font-family: Assistant !important;
  font-size: 16px;
  font-weight: ${(props) => props.fontWeight} ;
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
`;

const Link = ({ id, text, fontWeight, onClick }) => (
	<StyledLink id={id} to={''} fontWeight={fontWeight} onClick={onClick}>{text}</StyledLink>
);

Link.defaultProps = {
	fontWeight: '400'
}

Link.propTypes = {
	onClick: PropTypes.func.isRequired,
	text: PropTypes.string,
	id: PropTypes.string.isRequired,
	fontWeight: PropTypes.string
};

export default Link;
