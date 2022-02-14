import { Table } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useCallback, useMemo, useState } from 'react';
import { Column, TableOptions } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { ProcessRequestBlade } from '@cp/components';
import {
	CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG,
	requestStatusFilters,
	RequestTablePageSize,
} from '@cp/const/requests.const';
import { CPAdminLayout } from '@cp/layouts';
import { RequestStatusAll } from '@cp/types';
import { withI18n } from '@i18n/wrappers';
import { PaginationBar, ScrollableTabs, SearchBar, sortingIcons } from '@shared/components';
import { OrderDirection } from '@shared/types';
import { createPageTitle } from '@shared/utils';
import { useGetVisits } from '@visits/hooks/get-visits';
import { VisitInfo, VisitStatus } from '@visits/types';

import { RequestTableColumns } from './table.const';

const CPRequestsPage: NextPage = () => {
	const { t } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG);
	const [selected, setSelected] = useState<string | number | null>(null);

	// TODO integrate a loading state into the table component
	const { data: visits } = useGetVisits(
		filters.search,
		filters.status === RequestStatusAll.ALL ? undefined : filters.status,
		filters.page,
		RequestTablePageSize,
		filters.orderProp as keyof VisitInfo,
		filters.orderDirection as OrderDirection
	);

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
			const request = (row as { original: VisitInfo }).original;

			// Only open blade for "pending" requests
			if (request.status === VisitStatus.PENDING) {
				setSelected(request.id);
			}
		},
		[setSelected]
	);

	return (
		<>
			<Head>
				<title>{createPageTitle(t('pages/beheer/aanvragen/index___aanvragen'))}</title>
				<meta
					name="description"
					content={t('pages/beheer/aanvragen/index___aanvragen-meta-omschrijving')}
				/>
			</Head>

			<CPAdminLayout
				className="p-cp-requests"
				pageTitle={t('pages/beheer/aanvragen/index___aanvragen')}
			>
				<div className="l-container">
					<div className="p-cp-requests__header">
						<SearchBar
							backspaceRemovesValue={false}
							className="p-cp-requests__search"
							instanceId="requests-search-bar"
							light={true}
							placeholder={t('pages/beheer/aanvragen/index___zoek')}
							searchValue={filters.search}
							size="md"
							onClear={() => {
								setFilters({
									search: undefined,
									page: 1,
								});
							}}
							onSearch={(searchValue: string) => {
								setFilters({
									search: searchValue,
									page: 1,
								});
							}}
						/>

						<ScrollableTabs
							className="p-cp-requests__status-filter"
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
				</div>

				{(visits?.items?.length || 0) > 0 && (
					<div className="l-container p-cp__edgeless-container--lg">
						<Table
							className="u-mt-24"
							options={
								// TODO: fix type hinting
								/* eslint-disable @typescript-eslint/ban-types */
								{
									columns: RequestTableColumns(t) as Column<object>[],
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
				)}
			</CPAdminLayout>

			<ProcessRequestBlade
				isOpen={selected !== null}
				selected={visits?.items?.find((x) => x.id === selected)}
				onClose={() => setSelected(null)}
			/>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CPRequestsPage;
