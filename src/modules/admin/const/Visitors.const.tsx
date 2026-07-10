import { Button, type Column } from '@meemoo/react-components';
import { DropdownMenu } from '@shared/components/DropdownMenu';
import { UnreadMarker } from '@shared/components/UnreadMarker';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import type { VisitRequest } from '@shared/types/visit-request';
import { asDate, formatSameDayRange } from '@shared/utils/dates';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { isWithinInterval } from 'date-fns';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

export const VisitorsTablePageSize = 20;

export const ADMIN_VISITORS_QUERY_PARAM_CONFIG = {
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, 'startAt'),
	orderDirection: withDefault(SortDirectionParam, AvoSearchOrderDirection.DESC),
};

export const VisitorsTableColumns = (
	denyVisitRequest: (visitRequest: VisitRequest) => void,
	editVisitRequest: (visitRequest: VisitRequest) => void
): Column<VisitRequest>[] => [
	{
		header: tText('modules/admin/const/visitors___bezoekersruimte'),
		accessorKey: 'spaceName',
	},
	{
		header: tText('modules/admin/const/visitors___naam'),
		accessorKey: 'visitorName',
	},
	{
		header: tText('modules/admin/const/visitors___goedgekeurd-door'),
		accessorKey: 'updatedByName',
		cell: ({ row }) => {
			return (
				<span className="u-color-neutral" title={row.original.updatedByName}>
					{row.original.updatedByName}
				</span>
			);
		},
	},
	{
		header: tText('modules/admin/const/visitors___toegang'),
		accessorKey: 'startAt',
		cell: ({ row }) => {
			const start = asDate(row.original.startAt);
			const end = asDate(row.original.endAt);

			const active = start && end && isWithinInterval(new Date(), { start, end });

			return (
				<span className="u-color-neutral p-admin-visitors__access">
					<UnreadMarker active={active} />

					{formatSameDayRange(start, end)}
				</span>
			);
		},
	},
	{
		header: '',
		id: 'cp-visitors-histories-table-actions',
		cell: ({ row }) => {
			return (
				<DropdownMenu
					id={`cp-visitors-histories-table-actions__dropdown--${row.original.id}`}
					placement="bottom-end"
				>
					<Button
						variants="text"
						label={tText('modules/cp/const/visitors___toegang-intrekken')}
						onClick={() => denyVisitRequest(row.original)}
					/>
					<Button
						variants="text"
						label={tText('modules/cp/const/visitors___toegang-aanpassen')}
						onClick={() => editVisitRequest(row.original)}
					/>
				</DropdownMenu>
			);
		},
	},
];
