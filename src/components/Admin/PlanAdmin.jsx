import React from 'react';

import { List, Datagrid, TextField, ReferenceField } from 'react-admin';
import BookIcon from '@material-ui/icons/Book';

import Moment from 'react-moment';
import get from 'lodash/get';

const RateField = ({ source, record = {} }) => {
    return (
        <span>
            {record[source.split(',')[0]]} ({record[source.split(',')[1]]})
        </span>
    );
}

const LastUpdateField = ({ source, record = {} }) => {
    const value = get(record, source);
    return (
        <span>
            <Moment parse="YYYYMMDDHHmm" format="DD/MM/YYYY">
                {value}
            </Moment>
        </span>
    );
}

export const PlanList = (props) => (
    <List title="תוכניות" {...props}>
        <Datagrid>
            <TextField source="id" label="מזהה" />
            <TextField source="PLAN_COUNTY_NAME" label="רשות" />
            <LastUpdateField source="data.LAST_UPDATE" label="תאריך עדכון" sortable={false} />
            <TextField source="PL_NUMBER" label="מספר תוכנית" />
            <TextField source="PL_NAME" label="שם תוכנית" />
            <ReferenceField label="תגובות" source="id" reference="admin/comments" sortable={false}>
                <TextField source="comment_total" />
            </ReferenceField>
            <ReferenceField label="דירוג" source="id" reference="admin/rates" sortable={false}>
                <RateField source="rate_avg,rate_total" />
            </ReferenceField>
        </Datagrid>
    </List>
);

export const PlanIcon = BookIcon;
