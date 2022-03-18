import { TabProps } from '@meemoo/react-components';
import { isWithinInterval } from 'date-fns';
import { i18n, TFunction } from 'next-i18next';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { RequestStatusAll } from '@cp/types';
import { Icon, UnreadMarker } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { SortDirectionParam } from '@shared/helpers';
import { VisitInfo, VisitInfoRow } from '@shared/types';
import { formatAccessDates, parseDatabaseDate } from '@shared/utils';
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
			label: i18n?.t('modules/cp/const/visitors___alle'),
		},
		{
			id: VisitTimeframe.ACTIVE,
			label: i18n?.t('modules/cp/const/visitors___actief'),
		},
		{
			id: VisitTimeframe.PAST,
			label: i18n?.t('modules/cp/const/visitors___historiek'),
		},
	];
};

export const VisitorsTableColumns = (
	i18n: { t: TFunction } = { t: (x: string) => x }
): Column<VisitInfo>[] => [
	{
		Header: i18n.t('modules/cp/const/visitors___naam') || '',
		accessor: 'visitorName',
	},
	{
		Header: i18n.t('modules/cp/const/visitors___emailadres') || '',
		accessor: 'visitorMail',
		Cell: ({ row }: VisitInfoRow) => {
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
		Header: i18n.t('modules/cp/const/visitors___toegang') || '',
		accessor: 'startAt',
		Cell: ({ row }: VisitInfoRow) => {
			const start = row.original.startAt;
			const end = row.original.endAt;

			const active =
				!!start &&
				!!end &&
				isWithinInterval(new Date(), {
					start: parseDatabaseDate(start),
					end: parseDatabaseDate(end),
				});

			return (
				<span className="u-color-neutral p-cp-visitors__access">
					<UnreadMarker active={active} />

					{formatAccessDates(start, end)}
				</span>
			);
		},
	},
	{
		Header: i18n.t('modules/cp/const/visitors___goedgekeurd-door') || '',
		accessor: 'status',
		Cell: ({ row }: VisitInfoRow) => {
			return <span className="u-color-neutral">{row.original.updatedByName}</span>;
		},
	},
	{
		Header: '',
		id: 'cp-visitors-histories-table-actions',
		Cell: () => {
			return <Icon className="p-cp-visitors-histories__actions" name="dots-vertical" />;
		},
	},
];
