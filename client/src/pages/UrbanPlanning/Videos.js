import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import VideoCard from './VideoCard';
import videos from '../../shared/videos/videos.json';

const Container = styled.div`
    padding: 60px;
    margin-left: 80px;
    margin-right: 80px;
    box-shadow: 0px -2px 20px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    max-width: calc(100% - 160px);
    background: #fff;
`;

export default function Videos(props) {
    return (
        <Container className="container">
            <Grid container spacing={5}>
                {videos.map((video, i) => (
                    <VideoCard key={i} videoData={video}/>
                ))}
            </Grid>
        </Container>
    );
}
