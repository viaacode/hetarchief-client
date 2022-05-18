import { Column, Table, TableOptions } from '@meemoo/react-components';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import {
	ADMIN_REQUESTS_QUERY_PARAM_CONFIG,
	requestStatusFilters,
	RequestTableColumns,
	RequestTablePageSize,
} from '@admin/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { ProcessRequestBlade } from '@cp/components';
import { RequestStatusAll } from '@cp/types';
import { withI18n } from '@i18n/wrappers';
import { PaginationBar, ScrollableTabs, SearchBar, sortingIcons } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';
import { OrderDirection, Visit, VisitStatus } from '@shared/types';
import { createPageTitle } from '@shared/utils';
import { useGetVisits } from '@visits/hooks/get-visits';

const Requests: FC = () => {
	const { t } = useTranslation();
	const [filters, setFilters] = useQueryParams(ADMIN_REQUESTS_QUERY_PARAM_CONFIG);
	const [selected, setSelected] = useState<string | number | null>(null);
	const canEditVisitRequests: boolean | null = useHasAllPermission(
		Permission.APPROVE_DENY_ALL_VISIT_REQUESTS
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
			if (!canEditVisitRequests) {
				toastService.notify({
					title: t('pages/admin/leeszalenbeheer/aanvragen/index___geen-rechten'),
					description: t(
						'pages/admin/leeszalenbeheer/aanvragen/index___je-hebt-geen-rechten-om-bezoekaanvragen-te-bewerken'
					),
				});
				return;
			}
			const request = (row as { original: Visit }).original;
			setSelected(request.id);
		},
		[setSelected, canEditVisitRequests, t]
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
		<>
			<Head>
				<title>
					{createPageTitle(t('pages/admin/leeszalenbeheer/aanvragen/index___aanvragen'))}
				</title>
				<meta
					name="description"
					content={t(
						'pages/admin/leeszalenbeheer/aanvragen/index___aanvragen-meta-omschrijving'
					)}
				/>
			</Head>

			<AdminLayout pageTitle={t('pages/admin/leeszalenbeheer/aanvragen/index___aanvragen')}>
				<AdminLayout.Content>
					<div className="p-admin-requests l-container">
						<div className="p-admin-requests__header">
							<SearchBar
								default={filters[SEARCH_QUERY_KEY]}
								className="p-admin-requests__search"
								placeholder={t(
									'pages/admin/leeszalenbeheer/aanvragen/index___zoek'
								)}
								onSearch={(value) => setFilters({ [SEARCH_QUERY_KEY]: value })}
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
												start={
													Math.max(0, filters.page - 1) *
													RequestTablePageSize
												}
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
						<ProcessRequestBlade
							isOpen={selected !== null}
							selected={visits?.items?.find((x) => x.id === selected)}
							onClose={() => setSelected(null)}
							onFinish={refetch}
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(withAllRequiredPermissions(Requests, Permission.READ_ALL_VISIT_REQUESTS));
