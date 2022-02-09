import { Table } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useMemo } from 'react';
import { Column, TableOptions } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { RequestStatusChip } from '@cp/components';
import {
	CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG,
	RequestStatus,
	requestStatusFilters,
	RequestTablePageSize,
	RequestTableRow,
} from '@cp/const/requests.const';
import { CPAdminLayout } from '@cp/layouts';
import { withI18n } from '@i18n/wrappers';
import { Icon, PaginationBar, ScrollableTabs, SearchBar, sortingIcons } from '@shared/components';
import { mockData } from '@shared/components/Table/__mocks__/table';
import { createPageTitle } from '@shared/utils';

type RequestTableArgs = { row: { original: RequestTableRow } };

const CPRequestsPage: NextPage = () => {
	const { t } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG);

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

	const columns: Column<RequestTableRow>[] = [
		{
			Header: t('Naam') || '',
			accessor: 'name',
		},
		{
			Header: t('Emailadres') || '',
			accessor: 'email',
			Cell: ({ row }: RequestTableArgs) => {
				return (
					<Link href={`mailto:${row.original.email}`}>
						<a className="u-color-neutral p-cp-requests__link">{row.original.email}</a>
					</Link>
				);
			},
		},
		{
			Header: t('Tijdstip') || '',
			accessor: 'created_at',
			Cell: ({ row }: RequestTableArgs) => {
				return (
					<span className="u-color-neutral">
						{new Date(row.original.created_at).toLocaleString('nl-be')}
					</span>
				);
			},
		},
		{
			Header: t('Status') || '',
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

	const data = mockData.map((mock) => {
		return {
			...mock,
			email: `${mock.name}@example.com`.toLowerCase().replaceAll(' ', '.'),
			status: RequestStatus.approved,
		};
	});

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
							instanceId="requests-seach-bar"
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
							variants={['rounded', 'light', 'bordered']}
							onClick={(tabId) =>
								setFilters({
									...filters,
									status: tabId.toString(),
								})
							}
						/>
					</div>
				</div>

				{data.length > 0 && (
					<div className="l-container p-cp__edgeless-container--lg">
						<Table
							className="u-mt-24"
							options={
								// TODO: fix type hinting
								/* eslint-disable @typescript-eslint/ban-types */
								{
									columns: columns as Column<object>[],
									data: [...data, ...data, ...data, ...data], // 20
									initialState: {
										pageSize: RequestTablePageSize,
									},
								} as TableOptions<object>
								/* eslint-enable @typescript-eslint/ban-types */
							}
							sortingIcons={sortingIcons}
							pagination={({ gotoPage }) => {
								return (
									<PaginationBar
										className="u-mt-16 u-mb-16"
										count={RequestTablePageSize}
										start={filters.start}
										total={120} // TODO: fetch count from db
										onPageChange={(page) => {
											gotoPage(page);
											setFilters({
												...filters,
												start: page * RequestTablePageSize,
											});
										}}
									/>
								);
							}}
						/>
					</div>
				)}
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CPRequestsPage;
