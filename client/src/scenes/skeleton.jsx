import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Grid } from '@material-ui/core';

export default function Variants() {
    const array = [...Array(9).keys()];
    return (
        <Grid container spacing={5}>
            {array.map((i, index) => {
                return (
                    <Grid item xs={10} sm={6} md={4} key={index}>
                        <Stack
                            style={{ margin: '0.5rem', position: 'relative' }}
                        >
                            <Skeleton variant="rounded" height={215} />
                            {/* For other variants, adjust the size with `width` and `height` */}
                            <Skeleton
                                variant="circular"
                                width={40}
                                height={40}
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 12,
                                }}
                            />
                            <Skeleton
                                variant="text"
                                sx={{ fontSize: '1rem' }}
                            />
                            <Skeleton
                                variant="text"
                                sx={{ fontSize: '1rem' }}
                            />
                            <Skeleton
                                variant="rounded"
                                width={'90%'}
                                height={80}
                            />
                            <Skeleton
                                variant="text"
                                sx={{ fontSize: '1rem' }}
                            />
                        </Stack>
                    </Grid>
                );
            })}{' '}
        </Grid>
    );
}
