import styled from 'styled-components';
import { device, colors } from 'style/index';

export const AlertContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 30px 15px;
    gap: 30px;

    @media ${device.laptop} {
        max-width: 1140px;
        display: grid;
        margin: 30px auto 0;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: 'alert-plans alert-list'
                              'alert-trees alert-list';
    }
`

export const AlertSection = styled.div`
    grid-area: ${props => props.gridArea};
    flex: 1;
    padding: 30px;
    border-radius: 10px;
    background-color: ${colors.white};
    box-shadow: 0 9px 14px 0 rgba(0, 0, 0, 0.08);
`