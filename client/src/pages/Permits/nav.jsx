import { Box } from '@material-ui/core'
import React from 'react'
import * as SC from './style'

const PermitsNav = () => {
    return <SC.Layout>
        <Box display="flex" alignItems="center">
            <Box px={2}>
                <SC.StyledLink
                    id="sub-nav-permits"
                    to="/permits/">
                    טבלה ראשית
                </SC.StyledLink>
            </Box>
            <Box px={2}>
                <SC.StyledLink
                    id="sub-nav-aoi"
                    to="/permits/aoi/">
                    איזור אישי
                </SC.StyledLink>
            </Box>
        </Box>
    </SC.Layout >
}

export default PermitsNav