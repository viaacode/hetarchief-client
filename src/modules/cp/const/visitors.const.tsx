import { Button, OrderDirection, type TabProps } from '@meemoo/react-components';
import { isWithinInterval } from 'date-fns';
import { type Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { CopyButton } from '@shared/components/CopyButton';
import { DropdownMenu } from '@shared/components/DropdownMenu';
import { UnreadMarker } from '@shared/components/UnreadMarker';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import { type VisitRequest, type VisitRow } from '@shared/types/visit-request';
import { asDate, formatSameDayRange } from '@shared/utils/dates';
import { RequestStatusAll, VisitTimeframe } from '@visit-requests/types';

export const CP_ADMIN_VISITORS_QUERY_PARAM_CONFIG = {
	timeframe: withDefault(StringParam, RequestStatusAll.ALL),
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, 'startAt'),
	orderDirection: withDefault(SortDirectionParam, OrderDirection.desc),
};

export const visitorsStatusFilters = (): TabProps[] => {
	return [
		{
			id: RequestStatusAll.ALL,
			label: tText('modules/cp/const/visitors___alle'),
		},
		{
			id: VisitTimeframe.ACTIVE,
			label: tText('modules/cp/const/visitors___actief'),
		},
		{
			id: VisitTimeframe.PAST,
			label: tText('modules/cp/const/visitors___historiek'),
		},
	];
};

export const VisitorsTableColumns = (
	denyVisitRequest: (visitRequest: VisitRequest) => void,
	editVisitRequest: (visitRequest: VisitRequest) => void
): Column<VisitRequest>[] => [
	{
		Header: tText('modules/cp/const/visitors___naam'),
		accessor: 'visitorName',
	},
	{
		Header: tText('modules/cp/const/visitors___emailadres'),
		accessor: 'visitorMail',
		Cell: ({ row }: VisitRow) => (
			<CopyButton
				className="u-color-neutral u-p-0 c-table__copy"
				icon={undefined}
				variants="text"
				text={row.original.visitorMail}
			>
				{row.original.visitorMail}
			</CopyButton>
		),
	},
	{
		Header: tText('modules/cp/const/visitors___toegang'),
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
		Header: tText('modules/cp/const/visitors___goedgekeurd-door'),
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
