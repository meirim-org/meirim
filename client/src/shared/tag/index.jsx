import React from 'react';
// import * as SC from './style';
import {withTheme} from '@material-ui/core/styles';
import styled from 'styled-components';
import TagIcons from '../icons/TagIcons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const tagIcons = {
    Public: TagIcons.PublicInstitutesTagIcon,
    Commerce: TagIcons.CommerceTagIcon,
    Forest: TagIcons.OpenFieldTagIcon,
    Employment: TagIcons.OfficesTagIcon,
    Housing: TagIcons.ResidenceTagIcon,
    // transportation: TagIcons.TransportationTagIcon,
    Hoteliery: null,
    plus: TagIcons.PlusTagIcon,
    defaultIcon: null
}

const tagDisplayNames = {
    Public: 'מבני ציבור',
    Commerce: 'מסחר',
    Employment: 'תעסוקה',
    Housing: 'דיור',
    Hoteliery: 'מלונאות',
	Forest: 'שטח פתוח'
}

const TagWrapper = withTheme(styled.div`
    display: flex;
    align-items: center;
    height: 26.35px;
    background: #F5F5F5;
    border-radius: 4px;
    padding: 0 8px;
    margin: 0 0 10px 10px;
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
	return <OverlayTrigger key={id} overlay={<Tooltip>{tagDisplayNames[type]}</Tooltip>}>
        	<TagWrapper>
                    {tagIcons[type] && <TagIcon src={tagIcons[type]} />}
                    {tagDisplayNames[type]}
            </TagWrapper>
            </OverlayTrigger>;
}

export default Tag;