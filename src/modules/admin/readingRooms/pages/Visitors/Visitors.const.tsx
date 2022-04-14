import { Button } from '@meemoo/react-components';
import { isWithinInterval } from 'date-fns';
import { TFunction } from 'next-i18next';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { DropdownMenu, UnreadMarker } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { SortDirectionParam } from '@shared/helpers';
import { Visit, VisitRow } from '@shared/types';
import { asDate, formatSameDayRange } from '@shared/utils';

export const VisitorsTablePageSize = 20;

export const ADMIN_VISITORS_QUERY_PARAM_CONFIG = {
	[SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, undefined),
	orderDirection: withDefault(SortDirectionParam, undefined),
};

export const VisitorsTableColumns = (
	t: TFunction,
	denyVisitRequest: (visitRequest: Visit) => void,
	editVisitRequest: (visitRequest: Visit) => void
): Column<Visit>[] => [
	{
		Header: t('modules/admin/reading-rooms/pages/visitors/visitors___leeszaal') || '',
		accessor: 'spaceName',
	},
	{
		Header: t('modules/admin/reading-rooms/pages/visitors/visitors___naam') || '',
		accessor: 'visitorName',
	},
	{
		Header: t('modules/admin/reading-rooms/pages/visitors/visitors___goedgekeurd-door') || '',
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
		Header: t('modules/admin/reading-rooms/pages/visitors/visitors___toegang') || '',
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
						label={t('modules/cp/const/visitors___toegang-intrekken')}
						onClick={() => denyVisitRequest(row.original)}
					/>
					<Button
						variants="text"
						label={t('modules/cp/const/visitors___toegang-aanpassen')}
						onClick={() => editVisitRequest(row.original)}
					/>
				</DropdownMenu>
			);
		},
	},
];
