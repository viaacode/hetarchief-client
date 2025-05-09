import { Button, OrderDirection } from '@meemoo/react-components';
import { isWithinInterval } from 'date-fns';
import type { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { DropdownMenu } from '@shared/components/DropdownMenu';
import { UnreadMarker } from '@shared/components/UnreadMarker';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import type { VisitRequest, VisitRow } from '@shared/types/visit-request';
import { asDate, formatSameDayRange } from '@shared/utils/dates';

export const VisitorsTablePageSize = 20;

export const ADMIN_VISITORS_QUERY_PARAM_CONFIG = {
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, 'startAt'),
	orderDirection: withDefault(SortDirectionParam, OrderDirection.desc),
};

export const VisitorsTableColumns = (
	denyVisitRequest: (visitRequest: VisitRequest) => void,
	editVisitRequest: (visitRequest: VisitRequest) => void
): Column<VisitRequest>[] => [
	{
		Header: tText('modules/admin/const/visitors___bezoekersruimte'),
		accessor: 'spaceName',
	},
	{
		Header: tText('modules/admin/const/visitors___naam'),
		accessor: 'visitorName',
	},
	{
		Header: tText('modules/admin/const/visitors___goedgekeurd-door'),
		accessor: 'updatedByName',
		Cell: ({ row }: VisitRow) => {
			return (
				<span className="u-color-neutral" title={row.original.updatedByName}>
					{row.original.updatedByName}
				</span>
			);
		},
	},
	{
		Header: tText('modules/admin/const/visitors___toegang'),
		accessor: 'startAt',
		Cell: ({ row }: VisitRow) => {
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
		Header: '',
		id: 'cp-visitors-histories-table-actions',
		Cell: ({ row }: VisitRow) => {
			return (
				<DropdownMenu>
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
