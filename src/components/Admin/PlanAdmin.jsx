import React from 'react';

import { List, Datagrid, TextField, ReferenceField, downloadCSV } from 'react-admin';
import BookIcon from '@material-ui/icons/Book';

import moment from 'moment';
import get from 'lodash/get';
import geojsonArea from "@mapbox/geojson-area";
import jsonExport from 'jsonexport/dist';

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
    return (
        <span>
            {formatLastUpdateDate(get(record, source))}
        </span>
    );
}

const AreaChangeField = ({ source, unit = '', areaType = '', record = {} }) => {
    if (record[source] === undefined || record[source] === null || unit === '') {
        return null;
    } else {
        const areaValue = findPlanAreaByUnitAndType(record[source], unit, areaType);
        if (areaValue !== null) {
            return (
                <span>
                    {areaValue}
                </span>
            );
        } else {
            return null;
        }
    }
}

const GeometryAreaField = ({ source, record = {} }) => {
    return (
        <span>
            {record[source] ? getGeometryArea(record[source]) : 0}
        </span>
    );
}

const formatLastUpdateDate = (lastUpdate) => {
    return moment(lastUpdate, 'YYYYMMDDHHmm').format('DD/MM/YYYY');
}

const getGeometryArea = (geom) => {
    return Math.round(geojsonArea.geometry(geom));
}

const findPlanAreaByUnitAndType = (planArea, unit, areaType) => {
    const areaChanges = JSON.parse(planArea);
    const unitAreas = areaChanges[0].filter(e => e && e.length >= 3 && e[3].includes(unit));

    if (unitAreas.length === 0) {
        return null;
    } else if (areaType === '') {
        return unitAreas[0][6] || 0;
    } else {
        const unitTypeArea = unitAreas.find(e => e && e.length >= 3 && e[3].includes(areaType));

        if (unitTypeArea === undefined) {
            return null;
        } else {
            return unitTypeArea[6] || 0;
        }
    }
}

const PlanExporter = (plans) => {
    const plansForExport = plans.map(plan => {
        // separate some fields for formatting
        const { geom, areaChanges, data, rate_avg, rate_total, ...planForExport } = plan;

        // add calculated fields
        planForExport.lastUpdate = formatLastUpdateDate(data.LAST_UPDATE);
        planForExport.status = data.STATION_DESC;
        planForExport.planAreaMeters = getGeometryArea(geom);

        if (areaChanges !== undefined && areaChanges !== null) {
            planForExport.taasukaChangeMeters = findPlanAreaByUnitAndType(areaChanges, 'מ"ר', 'תעסוקה');
            planForExport.mischarChangeMeters = findPlanAreaByUnitAndType(areaChanges, 'מ"ר', 'מסחר');
            planForExport.megurimChangeMeters = findPlanAreaByUnitAndType(areaChanges, 'מ"ר', 'מגורים');
            planForExport.megurimChangeUnits = findPlanAreaByUnitAndType(areaChanges, 'יח"ד', 'מגורים');
            planForExport.tziburChangeMeters = findPlanAreaByUnitAndType(areaChanges, 'מ"ר', 'ציבור');
        }

        return planForExport;
    });

    jsonExport(plansForExport, {
        headers: ['id', 'PLAN_COUNTY_NAME', 'lastUpdate', 'PL_NUMBER', 'PL_NAME', 'status', 'taasukaChangeMeters', 'mischarChangeMeters', 'megurimChangeMeters', 'megurimChangeUnits', 'tziburChangeMeters', 'planAreaMeters', 'jurisdiction'],
        rename: ['מזהה', 'רשות', 'תאריך עדכון', 'מספר תוכנית', 'שם תוכנית', 'סטטוס', 'שינוי תעסוקה (מ"ר)', 'שינוי מסחר (מ"ר)', 'שינוי מגורים (מ"ר)', 'שינוי מגורים (יח"ד)', 'שינוי ציבור (מ"ר)', 'שטח התוכנית (מ"ר)', 'סמכות תכנון']
    }, (err, csv) => {
        downloadCSV(csv, 'plans');
    });
};

export const PlanList = (props) => (
    <List title="תוכניות" {...props} exporter={PlanExporter}>
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
