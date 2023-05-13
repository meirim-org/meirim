import React from 'react';
// import * as SC from './style';
import {withTheme} from '@material-ui/core/styles';
import styled from 'styled-components';
import TagIcons from '../icons/TagIcons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useTranslation } from '../../locale/he_IL';
import { get } from 'lodash';

const SUPPORTED_TAGS = {
    Public: {
        key: 'public',
        icon: TagIcons.PublicInstitutesTagIcon
    },
    Housing: {
        key: 'housing', 
        icon: TagIcons.ResidenceTagIcon
    },
    Commerce: {
        key: 'commerce', 
        icon: TagIcons.CommerceTagIcon
    },
    Employment: {
        key: 'employment', 
        icon: TagIcons.OfficesTagIcon
    },
    Hoteliery: {
        key: 'hoteliery', 
        icon: null
    },
    Forest: {
        key: 'forest', 
        icon: TagIcons.OpenFieldTagIcon
    },
    Streams: {
        key: 'river', 
        icon: TagIcons.RiverTagIcon
    },
    // eslint-disable-next-line
    'Light Rail': {
        key: 'lightRail', 
        icon: TagIcons.LightRailTagIcon
    }, 
    Default: {
        key: 'default',
        icon: TagIcons.LightRailTagIcon
    }
}

// const tagIcons = {
//     Public: TagIcons.PublicInstitutesTagIcon,
//     Commerce: TagIcons.CommerceTagIcon,
//     Forest: TagIcons.OpenFieldTagIcon,
//     Employment: TagIcons.OfficesTagIcon,
//     Housing: TagIcons.ResidenceTagIcon,
//     // Transportation: TagIcons.TransportationTagIcon,
//     Hoteliery: null,
//     // eslint-disable-next-line
//     ['Light Rail']: TagIcons.LightRailTagIcon,
//     plus: TagIcons.PlusTagIcon,
//     defaultIcon: null
// }

const TagWrapper = withTheme(styled.div`
    display: flex;
    align-items: center;
    height: 26.35px;
    background: #F5F5F5;
    border-radius: 4px;
    padding: 0 8px;
    margin: 0 0 5px 10px;
    font-size: 16px;
    font-weight: normal;
    color: ${props => props.theme.palette.black};
`);

const TagIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-left: 8px;
`;

const Tag = ({ type, id, }) => {

    const tag = SUPPORTED_TAGS[type] || SUPPORTED_TAGS.Default;
    const { t } = useTranslation();
    const displayName = get(t, `tags.${tag.key}`, 'תגית');

	return <OverlayTrigger key={id} overlay={<Tooltip>{displayName}</Tooltip>}>
                <TagWrapper>
                        {tag.icon && <TagIcon src={tag.icon} />}
                        {displayName}
                </TagWrapper>
                </OverlayTrigger>;
}

export default Tag;