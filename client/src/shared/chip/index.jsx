import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledChip = styled.div`
  display: inline-block;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  color: #4D20B2;
  background-color: #F5F5F5;
  border: 1px solid #4D20B2;
  border-radius: 100px;
  padding: 8px 16px;
  margin: 20px 10px;
`;

const Chip = ({ text }) => (
	<StyledChip> {text} </StyledChip>
);

export default Chip;
