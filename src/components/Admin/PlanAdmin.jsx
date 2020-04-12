import React from 'react';

import { List, Datagrid, TextField, ReferenceField } from 'react-admin';
import BookIcon from '@material-ui/icons/Book';

import Moment from 'react-moment';
import get from 'lodash/get';
import geojsonArea from "@mapbox/geojson-area";

// TODO: this should be shared with other admin components
const InnerUrlField = ({ source, urlPrefix = '', record = {} }) => {
    return (
        <a href={`/${urlPrefix}/${record[source]}`}>
            {record[source]}
        </a>
    );
}

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

const AreaChangeField = ({ source, unit = '', areaType = '', record = {} }) => {
    if (record[source] === undefined || record[source] === null || unit === '') {
        return null;
    } else {
        const areaChanges = JSON.parse(record[source]);
        const unitAreas = areaChanges[0].filter(e => e[3].includes(unit));

        if (unitAreas.length === 0) {
            return null;
        } else if (areaType === '') {
            return (
                <span>
                    {unitAreas[0][6] || 0}
                </span>
            );
        } else {
            const unitTypeArea = unitAreas.find(e => e[3].includes(areaType));

            if (unitTypeArea === undefined) {
                return null;
            } else {
                return (
                    <span>
                        {unitTypeArea[6] || 0}
                    </span>
                );
            }
        }
    }
}

const GeometryAreaField = ({ source, record = {} }) => {
    return (
        <span>
            {record[source] ? Math.round(geojsonArea.geometry(record[source])) : 0}
        </span>
    );
}

export const PlanList = (props) => (
    <List title="תוכניות" {...props}>
        <Datagrid>
            <InnerUrlField source="id" urlPrefix="plan" label="מזהה" />
            <TextField source="PLAN_COUNTY_NAME" label="רשות" />
            <LastUpdateField source="data.LAST_UPDATE" label="תאריך עדכון" sortable={false} />
            <TextField source="PL_NUMBER" label="מספר תוכנית" />
            <TextField source="PL_NAME" label="שם תוכנית" />
            <TextField source="data.STATION_DESC" label="סטטוס" />
            <AreaChangeField source="areaChanges" unit="מ&quot;ר" areaType="תעסוקה" label="שינוי תעסוקה (מ&quot;ר)" />
            <AreaChangeField source="areaChanges" unit="מ&quot;ר" areaType="מסחר" label="שינוי מסחר (מ&quot;ר)" />
            <AreaChangeField source="areaChanges" unit="מ&quot;ר" areaType="מגורים" label="שינוי מגורים (מ&quot;ר)" />
            <AreaChangeField source="areaChanges" unit="יח&quot;ד" label="שינוי מגורים (יח&quot;ד)" />
            <AreaChangeField source="areaChanges" unit="מ&quot;ר" areaType="ציבור" label="שינוי ציבור (מ&quot;ר)" />
            <GeometryAreaField source="geom" label="שטח התוכנית (מ&quot;ר)" />
            <TextField source="jurisdiction" label="סמכות תכנון" />
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
