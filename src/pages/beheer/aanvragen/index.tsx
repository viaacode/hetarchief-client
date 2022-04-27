import { Table } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useCallback, useMemo, useState } from 'react';
import { Column, TableOptions } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import { ProcessRequestBlade } from '@cp/components';
import {
	CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG,
	requestStatusFilters,
	RequestTableColumns,
	RequestTablePageSize,
} from '@cp/const/requests.const';
import { CPAdminLayout } from '@cp/layouts';
import { RequestStatusAll } from '@cp/types';
import { withI18n } from '@i18n/wrappers';
import { PaginationBar, ScrollableTabs, SearchBar, sortingIcons } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequeredPermissions';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';
import { OrderDirection, Visit, VisitStatus } from '@shared/types';
import { createPageTitle } from '@shared/utils';
import { useGetVisits } from '@visits/hooks/get-visits';

const CPRequestsPage: NextPage = () => {
	const { t } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG);
	const [selected, setSelected] = useState<string | number | null>(null);
	const canUpdateVisitRequests: boolean | null = useHasAllPermission(
		Permission.APPROVE_DENY_CP_VISIT_REQUESTS
	);

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
			if (!canUpdateVisitRequests) {
				toastService.notify({
					title: t('pages/beheer/aanvragen/index___geen-rechten'),
					description: t(
						'pages/beheer/aanvragen/index___je-hebt-geen-rechten-om-bezoekaanvragen-te-bewerken'
					),
				});
				return;
			}
			const request = (row as { original: Visit }).original;
			setSelected(request.id);
		},
		[setSelected, canUpdateVisitRequests, t]
	);

	// Render

	const renderEmptyMessage = (): string => {
		switch (filters.status) {
			case VisitStatus.APPROVED:
				return t('pages/beheer/aanvragen/index___er-zijn-geen-goedgekeurde-aanvragen');

			case VisitStatus.DENIED:
				return t('pages/beheer/aanvragen/index___er-zijn-geen-geweigerde-aanvragen');

			case VisitStatus.CANCELLED_BY_VISITOR:
				return t('pages/beheer/aanvragen/index___er-zijn-geen-geannuleerde-aanvragen');

			case VisitStatus.PENDING:
			default:
				return t('pages/beheer/aanvragen/index___er-zijn-geen-openstaande-aanvragen');
		}
	};

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
				contentTitle={t('pages/beheer/aanvragen/index___aanvragen')}
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

				{(visits?.items?.length || 0) > 0 ? (
					<div className="l-container l-container--edgeless-to-lg">
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
						{isFetching
							? t('pages/beheer/aanvragen/index___laden')
							: renderEmptyMessage()}
					</div>
				)}
			</CPAdminLayout>

			<ProcessRequestBlade
				isOpen={selected !== null}
				selected={visits?.items?.find((x) => x.id === selected)}
				onClose={() => setSelected(null)}
				onFinish={refetch}
			/>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(
	withAllRequiredPermissions(CPRequestsPage, Permission.READ_CP_VISIT_REQUESTS)
);
