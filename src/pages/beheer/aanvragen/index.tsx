import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useMemo } from 'react';
import { useQueryParams } from 'use-query-params';

import { withI18n } from '@i18n/wrappers';
import { ScrollableTabs, SearchBar } from '@shared/components';
import { createPageTitle } from '@shared/utils';

import {
	CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG,
	requestStatusFilters,
} from 'modules/cp/const/requests.const';
import { CPAdminLayout } from 'modules/cp/layouts';

const CPRequestsPage: NextPage = () => {
	const { t } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG);

	const statusFilters = useMemo(
		() =>
			requestStatusFilters.map((filter) => {
				return {
					...filter,
					active: filter.id === filters.status,
				};
			}),
		[filters.status]
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
				<div className="p-cp-requests__header">
					<ScrollableTabs
						className="p-cp-requests__status-filter"
						tabs={statusFilters}
						variants={['rounded', 'light', 'bordered']}
						onClick={(tabId) =>
							setFilters({
								...filters,
								status: parseInt(tabId.toString()),
							})
						}
					/>

					<SearchBar
						backspaceRemovesValue={false}
						className="p-cp-requests__search"
						instanceId="requests-seach-bar"
						light={true}
						placeholder={t('Zoek')}
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
				</div>
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default CPRequestsPage;
