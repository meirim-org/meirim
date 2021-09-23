import styled from 'styled-components';
import { colors, device } from 'style';

export const SearchBarWrapper = styled.div`
    font-family: 'Assistant';
    min-height: 42px;
    display: flex;
    flex-direction: column;
    padding: 20px 24px;
    margin-bottom: 16px;
    box-shadow: 0px 2px 13px rgba(0, 0, 0, 0.08);
    gap: 18px;
    background-color: ${colors.white};

    @media ${device.tablet} {
        flex-direction: row;
    }
    @media ${device.laptop} {
        padding: 14px 84px;
    }
`

export const Label = styled.div`
    font-size: 14px;
    color: ${colors.black};
    display: flex;
    align-items: center;
    gap: 9px;
`

export const Filters = styled.div`
  display: flex;
  gap: 10px;
`