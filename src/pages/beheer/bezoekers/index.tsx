import { Table } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useCallback, useMemo, useState } from 'react';
import { Column, TableOptions } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { withAuth } from '@auth/wrappers/with-auth';
import {
	CP_ADMIN_VISITS_QUERY_PARAM_CONFIG,
	RequestTablePageSize,
	visitsStatusFilters,
	VisitsTableColumns,
} from '@cp/const/requests.const';
import { CPAdminLayout } from '@cp/layouts';
import { RequestStatusAll } from '@cp/types';
import { withI18n } from '@i18n/wrappers';
import { PaginationBar, ScrollableTabs, SearchBar, sortingIcons } from '@shared/components';
import { OrderDirection } from '@shared/types';
import { createPageTitle } from '@shared/utils';
import { useGetVisits } from '@visits/hooks/get-visits';
import { VisitInfo, VisitStatus, VisitTimeframe } from '@visits/types';

const CPVisitorsPage: NextPage = () => {
	const { t } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_ADMIN_VISITS_QUERY_PARAM_CONFIG);
	// const [selected, setSelected] = useState<string | number | null>(null);

	const { data: visits, isFetching } = useGetVisits({
		searchInput: filters.search,
		status: VisitStatus.APPROVED,
		timeframe:
			filters.timeframe === RequestStatusAll.ALL
				? undefined
				: (filters.timeframe as VisitTimeframe),
		page: filters.page,
		size: RequestTablePageSize,
		orderProp: filters.orderProp as keyof VisitInfo,
		orderDirection: filters.orderDirection as OrderDirection,
	});

	// Filters

	const statusFilters = useMemo(
		() =>
			visitsStatusFilters().map((filter) => {
				return {
					...filter,
					active: filter.id === filters.timeframe,
				};
			}),
		[filters.timeframe]
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

	// const onRowClick = useCallback(
	// 	(e, row) => {
	// 		const request = (row as { original: VisitInfo }).original;
	// 		setSelected(request.id);
	// 	},
	// 	[setSelected]
	// );

	// Render

	const renderEmptyMessage = (): string => {
		switch (filters.timeframe) {
			case RequestStatusAll.ALL:
				return t('pages/beheer/bezoekers/index___er-zijn-nog-geen-bezoekers');

			case VisitTimeframe.ACTIVE:
				return t('pages/beheer/bezoekers/index___er-zijn-geen-actieve-bezoekers');

			case VisitTimeframe.PAST:
			default:
				return t(
					'pages/beheer/bezoekers/index___er-zijn-nog-geen-bezoekers-in-de-historiek'
				);
		}
	};

	return (
		<>
			<Head>
				<title>{createPageTitle(t('pages/beheer/bezoekers/index___bezoekers'))}</title>
				<meta
					name="description"
					content={t('pages/beheer/bezoekers/index___beheer-bezoekers-meta-omschrijving')}
				/>
			</Head>

			<CPAdminLayout
				className="p-cp-visitors"
				contentTitle={t('pages/beheer/bezoekers/index___bezoekers')}
			>
				<div className="l-container">
					<div className="p-cp-visitors__header">
						<SearchBar
							backspaceRemovesValue={false}
							className="p-cp-visitors__search"
							instanceId="visitors-search-bar"
							light={true}
							placeholder={t('pages/beheer/aanvragen/index___zoek')}
							searchValue={filters.search}
							size="md"
							onClear={() => {
								setFilters({
									search: '',
									page: 1,
								});
							}}
							onSearch={(searchValue: string) => {
								// Force rerender
								if (filters.search === searchValue) {
									setFilters({
										search: '',
										page: 1,
									});
								}

								setFilters({
									search: searchValue,
									page: 1,
								});
							}}
						/>

						<ScrollableTabs
							className="p-cp-visitors__status-filter"
							tabs={statusFilters}
							variants={['rounded', 'light', 'bordered', 'medium']}
							onClick={(tabId) =>
								setFilters({
									timeframe: tabId.toString(),
									page: 1,
								})
							}
						/>
					</div>
				</div>

				{(visits?.items?.length || 0) > 0 ? (
					<div className="l-container p-cp__edgeless-container--lg">
						<Table
							className="u-mt-24"
							options={
								// TODO: fix type hinting
								/* eslint-disable @typescript-eslint/ban-types */
								{
									columns: VisitsTableColumns(t) as Column<object>[],
									data: visits?.items || [],
									initialState: {
										pageSize: RequestTablePageSize,
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
										count={RequestTablePageSize}
										start={Math.max(0, filters.page - 1) * RequestTablePageSize}
										total={visits?.total || 0}
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
					<div className="l-container p-cp__edgeless-container--lg u-text-center u-color-neutral u-py-48">
						{isFetching
							? t('pages/beheer/aanvragen/index___laden')
							: renderEmptyMessage()}
					</div>
				)}
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(CPVisitorsPage);
