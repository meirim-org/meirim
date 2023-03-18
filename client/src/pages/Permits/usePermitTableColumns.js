import { useTranslation } from "locale/he_IL";
import React from 'react';
import * as SC from './style'
const { createColumnHelper } = require("@tanstack/react-table")

const columnHelper = createColumnHelper()

export default function usePermitTableColumns() {
    const { t } = useTranslation();

    const displayRealEstate = (context) => {
        if (context.getValue()['gush']) {
            return <SC.RealEstateItem>
                <span>גוש: {context.getValue()['gush']}, חלקה: {context.getValue()['helka']}</span>
                <a href={context.getValue()['mapUrl']} target="_blank" rel="noopener noreferrer">לאתר govmap</a>
            </SC.RealEstateItem>
        }
        else return null;
    };
    const columns = [
        columnHelper.accessor('permitRegion', {
            header: () => t.permitRegion
        }),
        columnHelper.accessor('permitSubject', {
            header: () => t.permitSubject
        }),
        columnHelper.accessor('permitPermitCreatedAt', {
            header: () => t.permitPermitCreatedAt,
            cell: (context) => new Date(context.getValue()).toLocaleDateString()
        }),
        columnHelper.accessor('permitRealEstate', {
            header: () => t.permitRealEstate,
            cell: displayRealEstate
        }),
        columnHelper.accessor('permitAuthor', {
            header: () => t.permitAuthor
        }),
        columnHelper.accessor('permitStatus', {
            header: () => t.permitStatus
        }),
        columnHelper.accessor('permitTimeline', {
            header: () => t.permitTimeline
        }),
        columnHelper.accessor('permitImportance', {
            header: () => t.permitImportance
        }),
    ]

    return columns
} 