import React from 'react';

import { List, Datagrid, DateField, TextField } from 'react-admin';
import BookIcon from '@material-ui/icons/Book';

const InnerUrlField = ({ source, urlPrefix = '', record = {} }) => {
    return (
        <a href={`/${urlPrefix}/${record[source]}`}>
            {record[source]}
        </a>
    );
}

export const CommentList = (props) => {
    return (
        <List title="תגובות" {...props}>
            <Datagrid>
                <TextField source="id" label="מזהה" />
                <InnerUrlField source="plan_id" label="תוכנית" urlPrefix="plan" />
                <DateField source="created_at" label="נכתבה" />
                <TextField source="content" label="תגובה" />
            </Datagrid>
        </List>
    );
};

export const CommentIcon = BookIcon;
