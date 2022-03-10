import { TFunction } from 'next-i18next';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { SortDirectionParam } from '@shared/helpers';
import { VisitInfo, VisitInfoRow } from '@shared/types';

export const HistoryItemListSize = 20;

export const ACCOUNT_HISTORY_QUERY_PARAM_CONFIG = {
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, undefined),
	orderDirection: withDefault(SortDirectionParam, undefined),
};

export const HistoryTableColumns = (
	i18n: { t: TFunction } = { t: (x: string) => x }
): Column<VisitInfo>[] => [
	{
		Header: i18n.t('modules/account/const/my-history___leeszaal') || '',
		id: 'cp-requests-access-space',
		accessor: 'spaceName',
	},
	{
		Header: i18n.t('modules/account/const/my-history___adres') || '',
		id: 'cp-requests-adderss',
		Cell: () => <span className="u-color-neutral">TODO</span>,
	},
	{
		Header: i18n.t('modules/account/const/my-history___toegang-van') || '',
		id: 'cp-requests-access-from',
		accessor: 'startAt',
		Cell: (data: VisitInfoRow) => {
			const visit = data.row.original;
			return <span className="u-color-neutral">{visit.startAt}</span>;
		},
	},
	{
		Header: i18n.t('modules/account/const/my-history___toegang-tot') || '',
		id: 'cp-requests-access-to',
		accessor: 'endAt',
		Cell: (data: VisitInfoRow) => {
			const visit = data.row.original;
			return <span className="u-color-neutral">{visit.endAt}</span>;
		},
	},
	{
		Header: i18n.t('modules/account/const/my-history___toegang') || '',
		id: 'cp-requests-access-from-to',
		Cell: (data: VisitInfoRow) => {
			const visit = data.row.original;
			return <span className="u-color-neutral">{`${visit.startAt} - ${visit.endAt}`}</span>;
		},
	},
	{
		Header: '',
		id: 'cp-requests-placeholder',
		Cell: () => null,
	},
];
