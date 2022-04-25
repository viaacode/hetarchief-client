import { Column, Table, TableOptions } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useQueryParams } from 'use-query-params';

import { ProcessRequestBlade } from '@cp/components';
import { RequestStatusAll } from '@cp/types';
import { PaginationBar, ScrollableTabs, SearchBar, sortingIcons } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { OrderDirection, Visit, VisitStatus } from '@shared/types';
import { useGetVisits } from '@visits/hooks/get-visits';

import {
	ADMIN_REQUESTS_QUERY_PARAM_CONFIG,
	requestStatusFilters,
	RequestTableColumns,
	RequestTablePageSize,
} from './Requests.const';

const ReadingRoomsOverview: FC = () => {
	const { t } = useTranslation();
	const [filters, setFilters] = useQueryParams(ADMIN_REQUESTS_QUERY_PARAM_CONFIG);
	const [selected, setSelected] = useState<string | number | null>(null);

	const {
		data: visits,
		refetch,
		isFetching,
	} = useGetVisits({
		searchInput: filters.search,
		status:
			filters.status === RequestStatusAll.ALL ? undefined : (filters.status as VisitStatus),
		page: filters.page,
		size: RequestTablePageSize,
		orderProp: filters.orderProp as keyof Visit,
		orderDirection: filters.orderDirection as OrderDirection,
	});

	// Filters

	const statusFilters = useMemo(
		() =>
			requestStatusFilters().map((filter) => {
				return {
					...filter,
					active: filter.id === filters.status,
				};
			}),
		[filters.status]
	);

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

	const onRowClick = useCallback(
		(e, row) => {
			const request = (row as { original: Visit }).original;
			setSelected(request.id);
		},
		[setSelected]
	);

	// Render

	const renderEmptyMessage = (): string => {
		switch (filters.status) {
			case VisitStatus.APPROVED:
				return t('pages/beheer/aanvragen/index___er-zijn-geen-goedgekeurde-aanvragen');

			case VisitStatus.DENIED:
				return t('pages/beheer/aanvragen/index___er-zijn-geen-geweigerde-aanvragen');

			case VisitStatus.PENDING:
			default:
				return t('pages/beheer/aanvragen/index___er-zijn-geen-openstaande-aanvragen');
		}
	};

	return (
		<div className="p-admin-requests">
			<h2 className="u-mb-40">
				{t('modules/admin/reading-rooms/pages/requests/requests___aanvragen')}
			</h2>
			<div className="p-admin-requests__header">
				<SearchBar
					backspaceRemovesValue={false}
					className="p-admin-requests__search"
					instanceId="requests-search-bar"
					light={true}
					placeholder={t('pages/beheer/aanvragen/index___zoek')}
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

				<ScrollableTabs
					className="p-admin-requests__status-filter"
					tabs={statusFilters}
					variants={['rounded', 'light', 'bordered', 'medium']}
					onClick={(tabId) =>
						setFilters({
							status: tabId.toString(),
							page: 1,
						})
					}
				/>
			</div>

			{(visits?.items?.length || 0) > 0 ? (
				<div className="l-container--edgeless-to-lg">
					<Table
						className="u-mt-24"
						options={
							// TODO: fix type hinting
							/* eslint-disable @typescript-eslint/ban-types */
							{
								columns: RequestTableColumns() as Column<object>[],
								data: visits?.items || [],
								initialState: {
									pageSize: RequestTablePageSize,
									sortBy: sortFilters,
								},
							} as TableOptions<object>
							/* eslint-enable @typescript-eslint/ban-types */
						}
						onRowClick={onRowClick}
						onSortChange={onSortChange}
						sortingIcons={sortingIcons}
						pagination={({ gotoPage }) => {
							return (
								<PaginationBar
									className="u-mt-16 u-mb-16"
									count={RequestTablePageSize}
									start={Math.max(0, filters.page - 1) * RequestTablePageSize}
									total={visits?.total || 0}
									onPageChange={(pageZeroBased) => {
										gotoPage(pageZeroBased);
										setSelected(null);
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
					{isFetching ? t('pages/beheer/aanvragen/index___laden') : renderEmptyMessage()}
				</div>
			)}
			<ProcessRequestBlade
				isOpen={selected !== null}
				selected={visits?.items?.find((x) => x.id === selected)}
				onClose={() => setSelected(null)}
				onFinish={refetch}
			/>
		</div>
	);
};

export default ReadingRoomsOverview;
