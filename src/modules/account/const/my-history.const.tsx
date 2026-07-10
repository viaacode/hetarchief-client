import { Button, type Column } from '@meemoo/react-components';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import type { VisitRequest } from '@shared/types/visit-request';
import { formatSameDayRange } from '@shared/utils/dates';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import type { MouseEvent } from 'react';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

export const HistoryItemListSize = 20;

export const ACCOUNT_HISTORY_QUERY_PARAM_CONFIG = {
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, 'startAt'),
	orderDirection: withDefault(SortDirectionParam, AvoSearchOrderDirection.DESC),
};

export const HistoryTableAccessComboId = 'account-history-from-to';
export const HistoryTableAccessFrom = 'startAt';

export type HistoryTableColumnProps = Column<VisitRequest>;

export const HistoryTableColumns = (
	onPlanVisit: (visit: VisitRequest) => void
): HistoryTableColumnProps[] => [
	{
		header: tText('modules/account/const/my-history___bezoekersruimte') || '',
		accessorKey: 'spaceName',
		cell: (data) => {
			const visit = data.row.original;
			return <span>{visit.spaceName}</span>;
		},
	},
	{
		header: tText('modules/account/const/my-history___toegang-van') || '',
		accessorKey: HistoryTableAccessFrom,
		cell: (data) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">{formatSameDayRange(visit.startAt, undefined)}</span>
			);
		},
	},
	{
		header: tText('modules/account/const/my-history___toegang-tot') || '',
		accessorKey: 'endAt',
		cell: (data) => {
			const visit = data.row.original;
			return <span className="u-color-neutral">{formatSameDayRange(undefined, visit.endAt)}</span>;
		},
	},
	{
		header: tText('modules/account/const/my-history___toegang') || '',
		id: HistoryTableAccessComboId,
		accessorKey: HistoryTableAccessFrom,
		cell: (data) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">{formatSameDayRange(visit.startAt, visit.endAt)}</span>
			);
		},
	},
	{
		header: '',
		id: 'account-history-placeholder',
		cell: (data) => {
			const visit = data.row.original;
			return (
				<Button
					className="u-font-size-14 u-p-8 u-m-2 u-text-left"
					variants={['text', 'block', 'fill', 'underline']}
					onClick={(e: MouseEvent) => {
						e.stopPropagation();
						onPlanVisit(visit);
					}}
					ariaLabel={tText('modules/account/const/my-history___bezoek')}
				>
					{tText('modules/account/const/my-history___bezoek')}
				</Button>
			);
		},
	},
];
