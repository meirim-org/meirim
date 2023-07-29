import { useTranslation } from "locale/he_IL";
const { createColumnHelper } = require("@tanstack/react-table")

const columnHelper = createColumnHelper()

export default function usePermitTableColumns() {
    const { t } = useTranslation();

    const columns = [
        columnHelper.accessor('permitSubject', {
            header: () => t.permitSubject
        }),
        columnHelper.accessor('permitPermitCreatedAt', {
            header: () => t.permitPermitCreatedAt,
            cell: (context) => new Date(context.getValue()).toLocaleDateString()
        }),
        columnHelper.accessor('permitRegion', {
            header: () => t.permitRegion
        }),
        columnHelper.accessor('permitRealEstate', {
            header: () => t.permitRealEstate
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

export function useUserAoisTableColumns() {
    const { t } = useTranslation();

    const columns = [
        columnHelper.accessor('name', {
            header: () => t.AOITitle
        }),
        columnHelper.accessor('permit_aoi.name', {
            header: () => t.permitRegion
        }),
        columnHelper.accessor('permit_aoi.url', {
            cell: t.undefined,
            header: () => t.GISFile,
        })
    ]

    return columns
}