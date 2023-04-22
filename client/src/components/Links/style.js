import styled from 'styled-components';
import { size } from '../../style';

export const LinksWrapper = styled.div`
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(${(props) => props.columns}, 1fr);
    @media screen and (max-width: ${size.tablet}) {
        grid-template-columns: 1fr;
    }
`;
