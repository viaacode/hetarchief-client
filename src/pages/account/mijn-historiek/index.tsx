import { OrderDirection, Table } from '@meemoo/react-components';
import { NextPage } from 'next';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { ReactNode, useMemo } from 'react';
import { TableState } from 'react-table';
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
import { ROUTES } from '@shared/const';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { AccessStatus, Visit, VisitStatus } from '@shared/types';
import { createHomeWithVisitorSpaceFilterUrl, createPageTitle } from '@shared/utils';
import { useGetVisitAccessStatusMutation } from '@visits/hooks/get-visit-access-status';
import { useGetVisits } from '@visits/hooks/get-visits';
import { VisitTimeframe } from '@visits/types';

import { VisitorLayout } from 'modules/visitors';

const { publicRuntimeConfig } = getConfig();

const AccountMyHistory: NextPage = () => {
	const { tHtml, tText } = useTranslation();
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

	const { mutateAsync: getAccessStatus } = useGetVisitAccessStatusMutation();

	const sortFilters = useMemo(() => {
		return [
			{
				id: filters.orderProp,
				desc: filters.orderDirection !== OrderDirection.asc,
			},
		];
	}, [filters]);

	// Events

	const onSortChange = (
		orderProp: string | undefined,
		orderDirection: OrderDirection | undefined
	) => {
		const orderPropResolved =
			orderProp === HistoryTableAccessComboId ? HistoryTableAccessFrom : orderProp;
		if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
			setFilters({
				...filters,
				orderProp: orderPropResolved,
				orderDirection,
				page: 1,
			});
		}
	};

	const onClickRow = async (visit: Visit) => {
		try {
			const response = await getAccessStatus(visit.spaceSlug);
			switch (response?.status) {
				case AccessStatus.ACCESS:
					router.push(`/${visit.spaceSlug}`);
					break;
				case AccessStatus.PENDING:
					router.push(ROUTES.visitRequested.replace(':slug', visit.spaceSlug));
					break;
				default:
					router.push(createHomeWithVisitorSpaceFilterUrl(visit));
					break;
			}
		} catch (err) {
			console.error(err);
			toastService.notify({
				title: tHtml('pages/account/mijn-historiek/index___error'),
				maxLines: 2,
				description: tHtml(
					'pages/account/mijn-historiek/index___het-controleren-van-je-toegang-tot-deze-bezoekersruimte-is-mislukt'
				),
			});
			router.push(createHomeWithVisitorSpaceFilterUrl(visit));
		}
	};

	// Render

	const renderEmptyMessage = (): string | ReactNode => {
		return tHtml('pages/account/mijn-historiek/index___geen-historiek');
	};

	return (
		<VisitorLayout>
			{renderOgTags(
				tText('pages/account/mijn-historiek/index___mijn-historiek'),
				tText('pages/account/mijn-historiek/index___mijn-historiek-meta-omschrijving'),
				publicRuntimeConfig.CLIENT_URL
			)}

			<AccountLayout
				className="p-account-my-history"
				pageTitle={tHtml('pages/account/mijn-historiek/index___mijn-historiek')}
			>
				{(visits.data?.items?.length || 0) > 0 ? (
					<div className="l-container l-container--edgeless-to-lg">
						<Table<Visit>
							className="u-mt-24"
							options={{
								columns: HistoryTableColumns(onClickRow),
								data: visits.data?.items || [],
								initialState: {
									pageSize: HistoryItemListSize,
									sortBy: sortFilters,
								} as TableState<Visit>,
							}}
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

export const getServerSideProps = withI18n();

export default withAuth(withAllRequiredPermissions(AccountMyHistory, Permission.MANAGE_ACCOUNT));
