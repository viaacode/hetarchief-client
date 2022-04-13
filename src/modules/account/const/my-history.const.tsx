import { TFunction } from 'next-i18next';
import Link from 'next/link';
import { Column, UseSortByColumnOptions } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { SortDirectionParam } from '@shared/helpers';
import { Visit, VisitRow } from '@shared/types';
import { createHomeWithReadingRoomFilterUrl, formatAccessDates } from '@shared/utils';

export const HistoryItemListSize = 20;

export const ACCOUNT_HISTORY_QUERY_PARAM_CONFIG = {
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, undefined),
	orderDirection: withDefault(SortDirectionParam, undefined),
};

export const HistoryTableAccessComboId = 'account-history-from-to';
export const HistoryTableAccessFrom = 'startAt';

export type HistoryTableColumnProps = Column<Visit> & UseSortByColumnOptions<Visit>;

export const HistoryTableColumns = (
	i18n: { t: TFunction } = { t: (x: string) => x }
): HistoryTableColumnProps[] => [
	{
		Header: i18n.t('modules/account/const/my-history___leeszaal') || '',
		accessor: 'spaceName',
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return <Link href={createHomeWithReadingRoomFilterUrl(visit)}>{visit.spaceName}</Link>;
		},
	},
	{
		Header: i18n.t('modules/account/const/my-history___adres') || '',
		accessor: 'spaceAddress',
		disableSortBy: true, // space.schema_maintainer.information is an array and can not be sorted on
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return <span className="u-color-neutral">{visit.spaceAddress}</span>;
		},
	},
	{
		Header: i18n.t('modules/account/const/my-history___toegang-van') || '',
		accessor: HistoryTableAccessFrom,
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">
					{formatAccessDates(visit.startAt, undefined)}
				</span>
			);
		},
	},
	{
		Header: i18n.t('modules/account/const/my-history___toegang-tot') || '',
		accessor: 'endAt',
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">{formatAccessDates(undefined, visit.endAt)}</span>
			);
		},
	},
	{
		Header: i18n.t('modules/account/const/my-history___toegang') || '',
		id: HistoryTableAccessComboId,
		accessor: HistoryTableAccessFrom,
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">
					{formatAccessDates(visit.startAt, visit.endAt)}
				</span>
			);
		},
	},
	{
		Header: '',
		id: 'account-history-placeholder',
		Cell: () => null,
	},
];
