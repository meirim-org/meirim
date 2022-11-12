import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { CircledPlayIcon, CircledPlayIconDark  } from '../../assets/icons';
import { useDispatch } from 'react-redux';
import { openModal } from 'redux/modal/slice';
import moment from 'moment';

const VideoCardMedia = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 292px;
    background: #ecf2df;
    background-image: url(${({thumbnail})=> thumbnail});
    background-size: cover;
    margin-bottom: 24px;
    cursor: pointer;
    &:after {
        position: absolute;
        content: url(${CircledPlayIcon});
    }
    &:hover:after {
        position: absolute;
        content: unset;
        content: url(${CircledPlayIconDark});
    }
`;

const VideoCardContent = styled.div`
    max-width: 456px;

    h3 {
        color: #270e78;
        font-weight: bold;
    }

    h4 {
        font-weight: 600;
        margin-bottom: 14px;
    }

    p {
        color: #666666;
    }
`;

const Duration = styled.div`
    position: absolute;
    right: 0;
    bottom: 12px;
    font-size: 18px;
    font-weight: semibold;
    padding: 8px 12px;
    background: #918899;
    color: #ffffff;
`;

export default function VideoCard({ videoData, thumbnail }) {
    const dispatch = useDispatch();
    const { title, subTitle, paragraph, duration, youtubeId } = videoData;

    function parseDuration(duration) {
        if (duration && moment.duration(duration).isValid()) {
            return `${moment.duration(duration).format('mm:ss')} דקות`;
        }

        return '';
    }

    return (
        <Grid item md={4}>
            <VideoCardMedia thumbnail={thumbnail} onClick={() => dispatch(openModal({ modalType: 'video', modalProps: {wrapperClass: 'videoModal', youtubeId} }))}>
                <Duration>{parseDuration(duration)}</Duration>
            </VideoCardMedia>
            <VideoCardContent>
                <h3>{title}</h3>
                <h4>{subTitle}</h4>
                <p>{paragraph}</p>
            </VideoCardContent>
        </Grid>
    );
}
