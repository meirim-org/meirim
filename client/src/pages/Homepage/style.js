import styled from 'styled-components'
import Typography from 'shared/typography';

export const H2 = styled(Typography).attrs(()=>({as:"h2", variant:"planTitle", mobileVariant:"planTitle", color: ""}))`
    padding-right: 80px;
    margin-bottom: 0;
    color: #999999;
`;

export const CommonSection = styled.section``
