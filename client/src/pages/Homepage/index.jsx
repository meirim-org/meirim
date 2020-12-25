import React from 'react';
import TopSection from './TopSection';
import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100%;
    max-width: 1441px;
    margin: 0 auto;
`;

const Homepage = () => {
    return (
        <Wrapper>
            <TopSection />
        </Wrapper>
    )
}

export default Homepage;