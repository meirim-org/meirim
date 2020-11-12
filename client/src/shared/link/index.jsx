import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLink = styled.span`
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

const Link = ({ text, bold = false }) => (
	<StyledLink href="#" bold={bold}>{text}</StyledLink>
);

Link.propTypes = {
	text: PropTypes.string.isRequired,
    bold: PropTypes.bool,
};

export default Link;
