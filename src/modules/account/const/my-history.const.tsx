import { Button } from '@meemoo/react-components';
import { Column, UseSortByColumnOptions } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { SortDirectionParam } from '@shared/helpers';
import { TranslationService } from '@shared/services/translation-service/translation-service';
import { OrderDirection, Visit, VisitRow } from '@shared/types';
import { formatSameDayRange } from '@shared/utils';

export const HistoryItemListSize = 20;

export const ACCOUNT_HISTORY_QUERY_PARAM_CONFIG = {
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, 'startAt'),
	orderDirection: withDefault(SortDirectionParam, OrderDirection.desc),
};

export const HistoryTableAccessComboId = 'account-history-from-to';
export const HistoryTableAccessFrom = 'startAt';

export type HistoryTableColumnProps = Column<Visit> & UseSortByColumnOptions<Visit>;

export const HistoryTableColumns = (
	onClickRow: (visit: Visit) => void
): HistoryTableColumnProps[] => [
	{
		Header: TranslationService.t('modules/account/const/my-history___bezoekersruimte') || '',
		accessor: 'spaceName',
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return <span>{visit.spaceName}</span>;
		},
	},
	{
		Header: TranslationService.t('modules/account/const/my-history___adres') || '',
		accessor: 'spaceAddress',
		disableSortBy: true, // space.schema_maintainer.information is an array and can not be sorted on
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return <span className="u-color-neutral">{visit.spaceAddress || ''}</span>;
		},
	},
	{
		Header: TranslationService.t('modules/account/const/my-history___toegang-van') || '',
		accessor: HistoryTableAccessFrom,
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">
					{formatSameDayRange(visit.startAt, undefined)}
				</span>
			);
		},
	},
	{
		Header: TranslationService.t('modules/account/const/my-history___toegang-tot') || '',
		accessor: 'endAt',
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">
					{formatSameDayRange(undefined, visit.endAt)}
				</span>
			);
		},
	},
	{
		Header: TranslationService.t('modules/account/const/my-history___toegang') || '',
		id: HistoryTableAccessComboId,
		accessor: HistoryTableAccessFrom,
		Cell: (data: VisitRow) => {
			const visit = data.row.original;
			return (
				<span className="u-color-neutral">
					{formatSameDayRange(visit.startAt, visit.endAt)}
				</span>
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
					variants={['text', 'block', 'fill']}
					onClick={() => onClickRow(visit)}
				>
					{TranslationService.t('modules/account/const/my-history___bezoek')}
				</Button>
			);
		},
	},
];
