import React from 'react';
import { WeNeedYou } from 'shared';
import TopSection from './TopSection';
import TopViews from './TopViews';
import CommunityDiscussions from './CommunityDiscussions';
import Wrapper from 'components/Wrapper';
import t from '../../locale/he_IL';
import { useTitle } from '../../hooks';

const Homepage = () => {
    useTitle(t.homepage);

    return (
        <Wrapper>
            <TopSection />
            <TopViews />
            <WeNeedYou />
            <CommunityDiscussions />
        </Wrapper>
    );
};

export default Homepage;
