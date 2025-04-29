import { Button, OrderDirection } from '@meemoo/react-components';
import type { MouseEvent } from 'react';
import type { Column, UseSortByColumnOptions } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import type { VisitRequest, VisitRow } from '@shared/types/visit-request';
import { formatSameDayRange } from '@shared/utils/dates';

export const HistoryItemListSize = 20;

export const ACCOUNT_HISTORY_QUERY_PARAM_CONFIG = {
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, 'startAt'),
	orderDirection: withDefault(SortDirectionParam, OrderDirection.desc),
};

export const HistoryTableAccessComboId = 'account-history-from-to';
export const HistoryTableAccessFrom = 'startAt';

export type HistoryTableColumnProps = Column<VisitRequest> & UseSortByColumnOptions<VisitRequest>;

export const HistoryTableColumns = (
	onPlanVisit: (visit: VisitRequest) => void
): HistoryTableColumnProps[] => [
	{
		Header: tText('modules/account/const/my-history___bezoekersruimte') || '',
		accessor: 'spaceName',
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return <span>{visit.spaceName}</span>;
		},
	},
	{
		Header: tText('modules/account/const/my-history___toegang-van') || '',
		accessor: HistoryTableAccessFrom,
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">{formatSameDayRange(visit.startAt, undefined)}</span>
			);
		},
	},
	{
		Header: tText('modules/account/const/my-history___toegang-tot') || '',
		accessor: 'endAt',
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return <span className="u-color-neutral">{formatSameDayRange(undefined, visit.endAt)}</span>;
		},
	},
	{
		Header: tText('modules/account/const/my-history___toegang') || '',
		id: HistoryTableAccessComboId,
		accessor: HistoryTableAccessFrom,
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">{formatSameDayRange(visit.startAt, visit.endAt)}</span>
			);
		},
	},
	{
		Header: '',
		id: 'account-history-placeholder',
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return (
				<Button
					className="u-font-size-14 u-py-16 u-text-left"
					variants={['text', 'block', 'fill', 'underline']}
					onClick={(e: MouseEvent) => {
						e.stopPropagation();
						onPlanVisit(visit);
					}}
				>
					{tText('modules/account/const/my-history___bezoek')}
				</Button>
			);
		},
	},
];
