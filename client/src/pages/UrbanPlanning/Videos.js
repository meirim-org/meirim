import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import VideoCard from './VideoCard';
import { device } from 'style';
import videos from '../../shared/videos/videos.json';
import VideoThumbnails from '../../assets/videos';

const Container = styled.div`
    padding: 30px;
    margin-left: 20px;
    margin-right: 20px;
    box-shadow: 0px -2px 20px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    max-width: calc(100% - 40px);
    background: #fff;
    @media ${device.tablet} {
      margin-left: 80px;
      margin-right: 80px;
      max-width: calc(100% - 160px);
      padding: 60px;
    }
`;

export default function Videos(props) {
    return (
        <Container className="container">
            <Grid container spacing={5}>
                {videos.map((video, i) => (
                    <VideoCard key={i} videoData={video} thumbnail={VideoThumbnails[video.youtubeId]}/>
                ))}
            </Grid>
        </Container>
    );
}
