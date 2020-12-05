import React from 'react';
import { Button } from 'shared'
import t from "locale/he_IL";
import * as SC from './style';

const Comments = () => (
        <Button
            id="sing-up"
            text={t.addNewComment}
            iconBefore={<SC.CommentIcon />}
            small
            altColor
            onClick='' />
);

export default Comments;
