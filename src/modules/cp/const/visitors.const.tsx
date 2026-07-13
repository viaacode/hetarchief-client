import { Button, type Column, type TabProps } from '@meemoo/react-components';
import { CopyButton } from '@shared/components/CopyButton';
import { DropdownMenu } from '@shared/components/DropdownMenu';
import { UnreadMarker } from '@shared/components/UnreadMarker';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import type { VisitRequest } from '@shared/types/visit-request';
import { asDate, formatSameDayRange } from '@shared/utils/dates';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { RequestStatusAll, VisitTimeframe } from '@visit-requests/types';
import { isWithinInterval } from 'date-fns';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

export const CP_ADMIN_VISITORS_QUERY_PARAM_CONFIG = {
	timeframe: withDefault(StringParam, RequestStatusAll.ALL),
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, 'startAt'),
	orderDirection: withDefault(SortDirectionParam, AvoSearchOrderDirection.DESC),
};

export const visitorsStatusFilters = (): TabProps[] => {
	return [
		{
			id: RequestStatusAll.ALL,
			label: tText('modules/cp/const/visitors___alle'),
			ariaLabel: tText('modules/cp/const/visitors___alle'),
		},
		{
			id: VisitTimeframe.ACTIVE,
			label: tText('modules/cp/const/visitors___actief'),
			ariaLabel: tText('modules/cp/const/visitors___actief'),
		},
		{
			id: VisitTimeframe.PAST,
			label: tText('modules/cp/const/visitors___historiek'),
			ariaLabel: tText('modules/cp/const/visitors___historiek'),
		},
	];
};

export const VisitorsTableColumns = (
	denyVisitRequest: (visitRequest: VisitRequest) => void,
	editVisitRequest: (visitRequest: VisitRequest) => void
): Column<VisitRequest>[] => [
	{
		header: tText('modules/cp/const/visitors___naam'),
		accessorKey: 'visitorName',
	},
	{
		header: tText('modules/cp/const/visitors___emailadres'),
		accessorKey: 'visitorMail',
		cell: ({ row }) => (
			<CopyButton
				className="u-color-neutral u-p-0 c-table__copy"
				icon={undefined}
				variants="text"
				text={row.original.visitorMail}
				ariaLabel={tText(
					'modules/cp/const/visitors___kopieer-het-email-adres-van-de-bezoeker-naar-je-klemboard'
				)}
			>
				{row.original.visitorMail}
			</CopyButton>
		),
	},
	{
		header: tText('modules/cp/const/visitors___toegang'),
		accessorKey: 'startAt',
		cell: ({ row }) => {
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
		header: tText('modules/cp/const/visitors___goedgekeurd-door'),
		accessorKey: 'updatedByName',
		cell: ({ row }) => {
			return <span className="u-color-neutral">{row.original.updatedByName}</span>;
		},
	},
	{
		header: '',
		id: 'cp-visitors-histories-table-actions',
		cell: ({ row }) => {
			return (
				<DropdownMenu
					id={`visit-request-overview__actions-dropdown--${row.original.id}`}
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
