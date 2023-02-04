import { Box } from '@material-ui/core'
import { useTranslation } from 'locale/he_IL'
import React, { useMemo } from 'react'
import * as SC from './style'

function isActive(path) {
    return window.location.pathname === path
}

const PermitsNav = () => {
    const { t } = useTranslation();

    const links = useMemo(() => ([
        {
            label: t.permitNav.mainTable,
            id: 'sub-nav-permits',
            path: '/permits/',
            isActive
        },
        {
            label: t.permitNav.AOI,
            id: 'sub-nav-permits-aoi',
            path: '/permits/aoi/',
            isActive
        }
    ]), [t])

    return <SC.Layout>
        <Box display="flex" alignItems="center">
            {links.map(link => (
                <Box px={2}>
                    <SC.StyledLink
                        isActive={() => link.isActive(link.path)}
                        id={link.id}
                        to={link.path}
                    >
                        {link.label}
                    </SC.StyledLink>
                </Box>
            ))}
        </Box>
    </SC.Layout >
}

export default PermitsNav