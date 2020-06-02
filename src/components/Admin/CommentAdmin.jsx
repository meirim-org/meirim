import React from 'react';

import { List, Datagrid, DateField, TextField, downloadCSV } from 'react-admin';
import BookIcon from '@material-ui/icons/Book';

import jsonExport from 'jsonexport/dist';

const InnerUrlField = ({ source, urlPrefix = '', record = {} }) => {
    return (
        <a href={`/${urlPrefix}/${record[source]}`}>
            {record[source]}
        </a>
    );
}

const CommentExporter = comments => {
    const commentsForExport = comments.map(comment => {
        // omit person_id and parent_id
        const { person_id, parent_id, ...commentForExport } = comment;
        return commentForExport;
    });

    jsonExport(commentsForExport, {
        headers: ['id', 'plan_id', 'content'],
        rename: ['מזהה', 'תוכנית', 'תגובה']
    }, (err, csv) => {
        downloadCSV(csv, 'comments');
    });
};

export const CommentList = (props) => {
    return (
        <List title="תגובות" {...props} exporter={CommentExporter}>
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
