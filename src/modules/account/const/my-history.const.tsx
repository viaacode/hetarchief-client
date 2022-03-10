import { TFunction } from 'next-i18next';
import Link from 'next/link';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { formatHistoryDates } from '@account/utils';
import { SortDirectionParam } from '@shared/helpers';
import { VisitInfo, VisitInfoRow } from '@shared/types';
import { createHomeWithReadingRoomFilterUrl } from '@shared/utils';

export const HistoryItemListSize = 20;

export const ACCOUNT_HISTORY_QUERY_PARAM_CONFIG = {
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, undefined),
	orderDirection: withDefault(SortDirectionParam, undefined),
};

export const HistoryTableAccessComboId = 'account-history-from-to';
export const HistoryTableAccessFrom = 'startAt';

export const HistoryTableColumns = (
	i18n: { t: TFunction } = { t: (x: string) => x }
): Column<VisitInfo>[] => [
	{
		Header: i18n.t('modules/account/const/my-history___leeszaal') || '',
		accessor: 'spaceName',
		Cell: (data: VisitInfoRow) => {
			const visit = data.row.original;
			return <Link href={createHomeWithReadingRoomFilterUrl(visit)}>{visit.spaceName}</Link>;
		},
	},
	{
		Header: i18n.t('modules/account/const/my-history___adres') || '',
		id: 'cp-requests-address', // Replace with accessor
		Cell: () => <span className="u-color-neutral">TODO</span>,
	},
	{
		Header: i18n.t('modules/account/const/my-history___toegang-van') || '',
		accessor: HistoryTableAccessFrom,
		Cell: (data: VisitInfoRow) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">
					{formatHistoryDates(visit.startAt, undefined)}
				</span>
			);
		},
	},
	{
		Header: i18n.t('modules/account/const/my-history___toegang-tot') || '',
		accessor: 'endAt',
		Cell: (data: VisitInfoRow) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">
					{formatHistoryDates(undefined, visit.endAt)}
				</span>
			);
		},
	},
	{
		Header: i18n.t('modules/account/const/my-history___toegang') || '',
		id: HistoryTableAccessComboId,
		accessor: HistoryTableAccessFrom,
		Cell: (data: VisitInfoRow) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">
					{formatHistoryDates(visit.startAt, visit.endAt)}
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
