import { Table } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useCallback, useMemo, useState } from 'react';
import { Column, TableOptions } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { ProcessRequestBlade } from '@cp/components/ProcessRequestBlade';
import {
	CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG,
	RequestStatus,
	requestStatusFilters,
	RequestTablePageSize,
} from '@cp/const/requests.const';
import { CPAdminLayout } from '@cp/layouts';
import { RequestTableRow } from '@cp/types';
import { withI18n } from '@i18n/wrappers';
import { PaginationBar, ScrollableTabs, SearchBar, sortingIcons } from '@shared/components';
import { mockData } from '@shared/components/Table/__mocks__/table';
import { createPageTitle } from '@shared/utils';

import { RequestTableColumns } from './table.const';

const lipsum =
	'Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris.';

const CPRequestsPage: NextPage = () => {
	const { t } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG);
	const [selected, setSelected] = useState<string | number | undefined>(undefined);

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

	const data = mockData.map((mock, i) => {
		return {
			...mock,
			email: `${mock.name}@example.com`.toLowerCase().replaceAll(' ', '.'),
			created_at: new Date(mock.created_at),
			status:
				filters.status === 'all' ? RequestStatus.open : (filters.status as RequestStatus),
			reason: Array(i + 1)
				.fill(lipsum)
				.join(' '),
			time: `Ik zou graag op ${new Date().toLocaleDateString()} jullie leeszaal willen bezoeken.`,
		};
	});

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
			const request = (row as { original: RequestTableRow }).original;

			// Only open blade for "open" requests
			if (request.status === RequestStatus.open) {
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
							instanceId="requests-seach-bar"
							light={true}
							placeholder={t('pages/beheer/aanvragen/index___zoek')}
							searchValue={filters.search}
							size="md"
							onClear={() => {
								setFilters({
									search: undefined,
								});
							}}
							onSearch={(searchValue: string) => {
								setFilters({
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
									columns: RequestTableColumns(t) as Column<object>[],
									data: [...data, ...data, ...data, ...data], // 20
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
										start={filters.start}
										total={120} // TODO: fetch count from db
										onPageChange={(page) => {
											gotoPage(page);
											setSelected(undefined);
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

			<ProcessRequestBlade
				selected={data.find((x) => x.id === selected)}
				isOpen={selected !== undefined}
				onClose={() => setSelected(undefined)}
			/>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CPRequestsPage;
