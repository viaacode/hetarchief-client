import { Button, TabProps } from '@meemoo/react-components';
import { isWithinInterval } from 'date-fns';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { RequestStatusAll } from '@cp/types';
import { DropdownMenu, UnreadMarker } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { SortDirectionParam } from '@shared/helpers';
import { i18n } from '@shared/helpers/i18n';
import { Visit, VisitRow } from '@shared/types';
import { asDate, formatSameDayRange } from '@shared/utils';
import { VisitTimeframe } from '@visits/types';

export const CP_ADMIN_VISITORS_QUERY_PARAM_CONFIG = {
	timeframe: withDefault(StringParam, RequestStatusAll.ALL),
	[SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, undefined),
	orderDirection: withDefault(SortDirectionParam, undefined),
};

export const visitorsStatusFilters = (): TabProps[] => {
	return [
		{
			id: RequestStatusAll.ALL,
			label: i18n.t('modules/cp/const/visitors___alle'),
		},
		{
			id: VisitTimeframe.ACTIVE,
			label: i18n.t('modules/cp/const/visitors___actief'),
		},
		{
			id: VisitTimeframe.PAST,
			label: i18n.t('modules/cp/const/visitors___historiek'),
		},
	];
};

export const VisitorsTableColumns = (
	denyVisitRequest: (visitRequest: Visit) => void,
	editVisitRequest: (visitRequest: Visit) => void
): Column<Visit>[] => [
	{
		Header: i18n.t('modules/cp/const/visitors___naam'),
		accessor: 'visitorName',
	},
	{
		Header: i18n.t('modules/cp/const/visitors___emailadres'),
		accessor: 'visitorMail',
		Cell: ({ row }: VisitRow) => {
			return (
				<a
					className="u-color-neutral c-table__link"
					href={`mailto:${row.original.visitorMail}`}
					onClick={(e) => e.stopPropagation()}
				>
					{row.original.visitorMail}
				</a>
			);
		},
	},
	{
		Header: i18n.t('modules/cp/const/visitors___toegang'),
		accessor: 'startAt',
		Cell: ({ row }: VisitRow) => {
			const start = asDate(row.original.startAt);
			const end = asDate(row.original.endAt);

			const active = start && end && isWithinInterval(new Date(), { start, end });

			return (
				<span className="u-color-neutral p-cp-visitors__access">
					<UnreadMarker active={active} />

					{formatSameDayRange(start, end)}
				</span>
			);
		},
	},
	{
		Header: i18n.t('modules/cp/const/visitors___goedgekeurd-door'),
		accessor: 'updatedByName',
		Cell: ({ row }: VisitRow) => {
			return <span className="u-color-neutral">{row.original.updatedByName}</span>;
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
						label={i18n.t('modules/cp/const/visitors___toegang-intrekken')}
						onClick={() => denyVisitRequest(row.original)}
					/>
					<Button
						variants="text"
						label={i18n.t('modules/cp/const/visitors___toegang-aanpassen')}
						onClick={() => editVisitRequest(row.original)}
					/>
				</DropdownMenu>
			);
		},
	},
];
