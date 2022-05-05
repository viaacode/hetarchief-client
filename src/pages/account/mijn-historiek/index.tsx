import { Table } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { Column, TableOptions } from 'react-table';
import { useQueryParams } from 'use-query-params';

import {
	ACCOUNT_HISTORY_QUERY_PARAM_CONFIG,
	HistoryItemListSize,
	HistoryTableAccessComboId,
	HistoryTableAccessFrom,
	HistoryTableColumns,
	Permission,
} from '@account/const';
import { AccountLayout } from '@account/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { Loading, PaginationBar, sortingIcons } from '@shared/components';
import { ROUTES, SEARCH_QUERY_KEY } from '@shared/const';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequeredPermissions';
import { toastService } from '@shared/services/toast-service';
import { OrderDirection, Visit, VisitStatus } from '@shared/types';
import { createHomeWithReadingRoomFilterUrl, createPageTitle } from '@shared/utils';
import { useGetVisitAccessStatus } from '@visits/hooks/get-visit-access-status';
import { useGetVisits } from '@visits/hooks/get-visits';
import { VisitTimeframe } from '@visits/types';

import { VisitorLayout } from 'modules/visitors';

const AccountMyHistory: NextPage = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const [filters, setFilters] = useQueryParams(ACCOUNT_HISTORY_QUERY_PARAM_CONFIG);

	const visits = useGetVisits({
		searchInput: undefined,
		status: VisitStatus.APPROVED,
		timeframe: VisitTimeframe.PAST,
		page: filters.page,
		size: HistoryItemListSize,
		orderProp: filters.orderProp as keyof Visit,
		orderDirection: filters.orderDirection as OrderDirection,
		personal: true,
	});

	const { mutateAsync: getAccessStatus } = useGetVisitAccessStatus();

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
			let orderProp = rules[0]?.id || undefined;
			orderProp =
				orderProp === HistoryTableAccessComboId ? HistoryTableAccessFrom : orderProp;

			setFilters({
				...filters,
				orderProp,
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

	const onClickRow = async (visit: Visit) => {
		try {
			const response = await getAccessStatus(visit.spaceId);
			switch (response?.status) {
				case VisitStatus.APPROVED:
					router.push(`/${visit.spaceSlug}`);
					break;
				case VisitStatus.PENDING:
					router.push(ROUTES.visitRequested.replace(':slug', visit.spaceSlug));
					break;
				default:
					router.push(createHomeWithReadingRoomFilterUrl(visit));
					break;
			}
		} catch (err) {
			console.error(err);
			toastService.notify({
				title: t('pages/account/mijn-historiek/index___error'),
				maxLines: 2,
				description: t(
					'pages/account/mijn-historiek/index___het-controleren-van-je-toegang-tot-deze-bezoekersruimte-is-mislukt'
				),
			});
			router.push(createHomeWithReadingRoomFilterUrl(visit));
		}
	};

	// Render

	const renderEmptyMessage = (): string => {
		return t('pages/account/mijn-historiek/index___geen-historiek');
	};

	return (
		<VisitorLayout>
			<Head>
				<title>
					{createPageTitle(t('pages/account/mijn-historiek/index___mijn-historiek'))}
				</title>
				<meta
					name="description"
					content={t(
						'pages/account/mijn-historiek/index___mijn-historiek-meta-omschrijving'
					)}
				/>
			</Head>

			<AccountLayout
				className="p-account-my-history"
				contentTitle={t('pages/account/mijn-historiek/index___mijn-historiek')}
			>
				{(visits.data?.items?.length || 0) > 0 ? (
					<div className="l-container l-container--edgeless-to-lg">
						<Table
							className="u-mt-24"
							options={
								// TODO: fix type hinting
								/* eslint-disable @typescript-eslint/ban-types */
								{
									columns: HistoryTableColumns(
										{ t },
										onClickRow
									) as Column<object>[],
									data: visits.data?.items || [],
									initialState: {
										pageSize: HistoryItemListSize,
										sortBy: sortFilters,
									},
								} as TableOptions<object>
								/* eslint-enable @typescript-eslint/ban-types */
							}
							onSortChange={onSortChange}
							sortingIcons={sortingIcons}
							pagination={({ gotoPage }) => {
								return (
									<PaginationBar
										className="u-mt-16 u-mb-16"
										count={HistoryItemListSize}
										start={Math.max(0, filters.page - 1) * HistoryItemListSize}
										total={visits.data?.total || 0}
										onPageChange={(pageZeroBased) => {
											gotoPage(pageZeroBased);
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
						{visits.isFetching ? <Loading fullscreen /> : renderEmptyMessage()}
					</div>
				)}
			</AccountLayout>
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(withAllRequiredPermissions(AccountMyHistory, Permission.MANAGE_ACCOUNT));
