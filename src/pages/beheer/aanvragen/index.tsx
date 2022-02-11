import { Table } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { Column, TableOptions } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { RequestStatusChip } from '@cp/components';
import { ProcessRequestBlade } from '@cp/components/ProcessRequestBlade';
import {
	CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG,
	requestCreatedAtFormatter,
	RequestStatusAll,
	requestStatusFilters,
	RequestTablePageSize,
} from '@cp/const/requests.const';
import { CPAdminLayout } from '@cp/layouts';
import { withI18n } from '@i18n/wrappers';
import { Icon, PaginationBar, ScrollableTabs, SearchBar, sortingIcons } from '@shared/components';
import { createPageTitle } from '@shared/utils';
import { useGetVisits } from '@visits/hooks/get-visits';
import { VisitInfo, VisitStatus } from '@visits/types';

type RequestTableArgs = { row: { original: VisitInfo } };

const CPRequestsPage: NextPage = () => {
	const { t } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG);
	const [selected, setSelected] = useState<string | number | undefined>(undefined);

	// TODO integrate a loading state into the table component
	const { data: visits } = useGetVisits(
		filters.search,
		filters.status === RequestStatusAll.ALL ? undefined : filters.status,
		filters.page,
		RequestTablePageSize
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
				id: filters.sort,
				desc: filters.order !== 'asc',
			},
		];
	}, [filters]);

	// Config

	const columns: Column<VisitInfo>[] = [
		{
			Header: t('pages/beheer/aanvragen/index___naam') || '',
			accessor: 'visitorName',
		},
		{
			Header: t('pages/beheer/aanvragen/index___emailadres') || '',
			accessor: 'visitorMail',
			Cell: ({ row }: RequestTableArgs) => {
				return (
					<Link href={`mailto:${row.original.visitorMail}`}>
						<a className="u-color-neutral p-cp-requests__link">
							{row.original.visitorMail}
						</a>
					</Link>
				);
			},
		},
		{
			Header: t('pages/beheer/aanvragen/index___tijdstip') || '',
			accessor: 'createdAt',
			Cell: ({ row }: RequestTableArgs) => {
				return (
					<span className="u-color-neutral">
						{requestCreatedAtFormatter(row.original.createdAt)}
					</span>
				);
			},
		},
		{
			Header: t('pages/beheer/aanvragen/index___status') || '',
			accessor: 'status',
			Cell: ({ row }: RequestTableArgs) => {
				return <RequestStatusChip status={row.original.status} />;
			},
		},
		{
			Header: '',
			id: 'cp-requests-table-actions',
			Cell: () => {
				return <Icon className="p-cp-requests__actions" name="dots-vertical" />;
			},
		},
	];

	// Events

	const onSortChange = useCallback(
		(rules) => {
			setFilters({
				...filters,
				sort: rules[0]?.id || undefined,
				order: rules[0] ? (rules[0].desc ? 'desc' : 'asc') : undefined,
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
									...filters,
									search: undefined,
								});
							}}
							onSearch={(searchValue: string) => {
								setFilters({
									...filters,
									search: searchValue,
								});
							}}
						/>

						<ScrollableTabs
							className="p-cp-requests__status-filter"
							tabs={statusFilters}
							variants={['rounded', 'light', 'bordered', 'medium']}
							onClick={(tabId) =>
								setFilters({
									...filters,
									status: tabId.toString(),
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
									columns: columns as Column<object>[],
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
											setSelected(undefined);
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
				selected={visits?.items?.find((x) => x.id === selected)}
				isOpen={selected !== undefined}
				onClose={() => {
					setSelected(undefined);
				}}
			/>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CPRequestsPage;
