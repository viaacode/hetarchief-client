import { Column, Table, TableOptions } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import React, { FC, useCallback, useMemo } from 'react';
import { useQueryParams } from 'use-query-params';

import { PaginationBar, SearchBar, sortingIcons } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { OrderDirection } from '@shared/types';

import {
	ADMIN_READING_ROOMS_OVERVIEW_QUERY_PARAM_CONFIG,
	ReadingRoomsOverviewTableColumns,
	ReadingRoomsOverviewTablePageSize,
} from './ReadingRoomsOverview.const';
import { READING_ROOMS_OVERVIEW_MOCK } from './__mocks__/readingRoomsOverview';

const ReadingRoomsOverview: FC = () => {
	const { t } = useTranslation();
	const [filters, setFilters] = useQueryParams(ADMIN_READING_ROOMS_OVERVIEW_QUERY_PARAM_CONFIG);

	// Filters

	const sortFilters = useMemo(() => {
		return [
			{
				id: filters.orderProp,
				desc: filters.orderDirection !== OrderDirection.asc,
			},
		];
	}, [filters]);

	// Events

	const onSortChange = useCallback(
		(rules) => {
			setFilters({
				...filters,
				orderProp: rules[0]?.id || undefined,
				orderDirection: rules[0]
					? rules[0].desc
						? OrderDirection.desc
						: OrderDirection.asc
					: undefined,
				page: 1,
			});
		},
		[filters, setFilters]
	);

	// Render

	const renderEmptyMessage = (): string => {
		// switch (filters.status) {
		// 	case VisitStatus.APPROVED:
		// 		return t('pages/beheer/aanvragen/index___er-zijn-geen-goedgekeurde-aanvragen');

		// 	case VisitStatus.DENIED:
		// 		return t('pages/beheer/aanvragen/index___er-zijn-geen-geweigerde-aanvragen');

		// 	case VisitStatus.PENDING:
		// 	default:
		// 		return t('pages/beheer/aanvragen/index___er-zijn-geen-openstaande-aanvragen');
		// }
		return t('Geen leeszalen gevonden');
	};

	return (
		<div>
			<h2 className="u-mb-40">{t('Alle leeszalen')}</h2>
			<div className="l-container">
				<div className="p-admin-reading-rooms__header">
					<SearchBar
						backspaceRemovesValue={false}
						className="p-admin-reading-rooms__search"
						instanceId="admin-reading-rooms-search-bar"
						light={true}
						placeholder={t('zoek')}
						searchValue={filters.search}
						size="md"
						onClear={() => {
							setFilters({
								[SEARCH_QUERY_KEY]: '',
								page: 1,
							});
						}}
						onSearch={(searchValue: string) => {
							// Force rerender
							if (filters.search === searchValue) {
								setFilters({
									[SEARCH_QUERY_KEY]: '',
									page: 1,
								});
							}

							setFilters({
								[SEARCH_QUERY_KEY]: searchValue,
								page: 1,
							});
						}}
					/>
				</div>
			</div>
			{(READING_ROOMS_OVERVIEW_MOCK.items.length || 0) > 0 ? (
				<div className="l-container l-container--edgeless-to-lg">
					<Table
						className="u-mt-24"
						options={
							// TODO: fix type hinting
							/* eslint-disable @typescript-eslint/ban-types */
							{
								columns: ReadingRoomsOverviewTableColumns({
									t,
								}) as Column<object>[],
								data: READING_ROOMS_OVERVIEW_MOCK.items || [],
								initialState: {
									pageSize: ReadingRoomsOverviewTablePageSize,
									sortBy: sortFilters,
								},
							} as TableOptions<object>
							/* eslint-enable @typescript-eslint/ban-types */
						}
						// onRowClick={onRowClick}
						onSortChange={onSortChange}
						sortingIcons={sortingIcons}
						pagination={({ gotoPage }) => {
							return (
								<PaginationBar
									className="u-mt-16 u-mb-16"
									count={ReadingRoomsOverviewTablePageSize}
									start={
										Math.max(0, filters.page - 1) *
										ReadingRoomsOverviewTablePageSize
									}
									total={READING_ROOMS_OVERVIEW_MOCK.total || 0}
									onPageChange={(pageZeroBased) => {
										gotoPage(pageZeroBased);
										// setSelected(null);
										setFilters({
											...filters,
											page: pageZeroBased + 1,
										});
									}}
								/>
							);
						}}
					/>
				</div>
			) : (
				<div className="l-container l-container--edgeless-to-lg u-text-center u-color-neutral u-py-48">
					{/* {isFetching ? t('pages/beheer/aanvragen/index___laden') : renderEmptyMessage()} */}
					{renderEmptyMessage()}
				</div>
			)}
		</div>
	);
};

export default ReadingRoomsOverview;
