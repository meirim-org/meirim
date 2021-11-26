import React from 'react';
import YoutubeVideo from 'react-youtube';
import styled from 'styled-components';
import merchav from 'assets/merchav-logo.svg';
import { Button } from 'shared';

const VideoWrapper = styled.div`
    /* position: relative; */
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;

    .youtube-video {
        align-self: stretch;
    }
`;

const VideoBanner = styled.div`
    position: absolute;
    width: 509px;
    height: 144px;
    display: flex;
    justify-content: space-between;
    background: linear-gradient(0deg, #652dd0, #652dd0);
    bottom: -222px;
    box-shadow: 0px 29.6621px 147.057px rgba(0, 0, 0, 0.0503198),
        0px 15.8588px 78.6238px rgba(0, 0, 0, 0.0417275),
        0px 8.8903px 44.0759px rgba(0, 0, 0, 0.035),
        0px 4.72157px 23.4084px rgba(0, 0, 0, 0.0282725);
    border-radius: 12px;
    padding: 24px 32px;
`;

const VideoBannerSection = styled.div`
    display: flex;
    flex-direction: column;
    color: #ffffff;
`;

const Title = styled.h3`
    /* color: #FFFFFF; */
`;

const InCollaboration = styled.div`
    img {
        margin-right: 12px;
        margin-bottom: 16px;
    }
`;

const CourseButton = styled.div`
    background: #ffffff;
    border-radius: 4px;
    width: 120px;
    height: 32px;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-end;
    cursor: pointer;
`;

export default function video({ youtubeId }) {
    return (
        <VideoWrapper>
            <YoutubeVideo
                containerClassName="youtube-video"
                opts={{ width: '100%' }}
                videoId={youtubeId}
            />
            <VideoBanner>
                <VideoBannerSection className="right">
                    <h3>רוצים להיות מומחים?</h3>
                    <span>הכנו עבורכם קורס מעמיק שיתן לכם</span>
                    <span>כלים חשובים ומקיפים</span>
                </VideoBannerSection>
                <VideoBannerSection className="left">
                    <InCollaboration>
                        <span>בשיתוף</span>
                        <img src={merchav} alt="merchav" />
                    </InCollaboration>
                    <CourseButton>לקורס המלא</CourseButton>
                </VideoBannerSection>
            </VideoBanner>
        </VideoWrapper>
    );
}
