import { OrderDirection, Table } from '@meemoo/react-components';
import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, MouseEvent, ReactNode, useMemo, useState } from 'react';
import { Row, TableState } from 'react-table';
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
import { Loading, PaginationBar, sortingIcons } from '@shared/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { VisitDetailBlade } from '@shared/components/VisitDetailBlade';
import { ROUTE_PARTS, ROUTES } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { AccessStatus, Visit } from '@shared/types';
import { DefaultSeoInfo } from '@shared/types/seo';
import { createVisitorSpacesWithFilterUrl } from '@shared/utils';
import { useGetVisitAccessStatusMutation } from '@visits/hooks/get-visit-access-status';
import { useGetVisits } from '@visits/hooks/get-visits';

import { VisitorLayout } from 'modules/visitors';

const AccountMyHistory: NextPage<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();
	const router = useRouter();
	const [filters, setFilters] = useQueryParams(ACCOUNT_HISTORY_QUERY_PARAM_CONFIG);
	const [currentDetailVisit, setCurrentDetailVisit] = useState<Visit | null>(null);
	const [isVisitDetailBladeOpen, setIsDetailBladeOpen] = useState(false);

	const visits = useGetVisits({
		searchInput: undefined,
		page: filters.page,
		size: HistoryItemListSize,
		orderProp: filters.orderProp as keyof Visit,
		orderDirection: filters.orderDirection as OrderDirection,
		personal: true,
	});

	// Don't show hardcoded access
	const filteredVisits = visits.data?.items.filter((visit) => !visit.id.includes('permanent-id'));

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
		if (!orderProp) {
			orderProp = 'startAt';
		}
		if (!orderDirection) {
			orderDirection = OrderDirection.desc;
		}
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
					router.push(`/${ROUTE_PARTS.visit}/${visit.spaceSlug}`);
					break;
				case AccessStatus.PENDING:
					router.push(ROUTES.visitRequested.replace(':slug', visit.spaceSlug));
					break;
				default:
					router.push(createVisitorSpacesWithFilterUrl(visit));
					break;
			}
		} catch (err) {
			console.error(err);
			toastService.notify({
				title: tHtml('pages/account/mijn-bezoek-historiek/index___error'),
				maxLines: 2,
				description: tHtml(
					'pages/account/mijn-bezoek-historiek/index___het-controleren-van-je-toegang-tot-deze-bezoekersruimte-is-mislukt'
				),
			});
			router.push(createVisitorSpacesWithFilterUrl(visit));
		}
	};

	const onRowClick = (evt: MouseEvent<HTMLTableRowElement>, row: Row<Visit>) => {
		setCurrentDetailVisit(row.original);
		setIsDetailBladeOpen(true);
	};

	// Render

	const renderEmptyMessage = (): string | ReactNode => {
		return tHtml('pages/account/mijn-bezoek-historiek/index___geen-bezoek-historiek');
	};

	const renderPageContent = () => {
		return (
			<AccountLayout
				className="p-account-my-history"
				pageTitle={tText(
					'pages/account/mijn-bezoek-historiek/index___mijn-bezoek-historiek'
				)}
			>
				{(filteredVisits?.length || 0) > 0 ? (
					<div className="l-container l-container--edgeless-to-lg">
						<Table<Visit>
							className="u-mt-24"
							style={{ cursor: 'pointer' }}
							onRowClick={onRowClick}
							options={{
								columns: HistoryTableColumns(onClickRow),
								data: filteredVisits || [],
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
						{visits.isFetching ? (
							<Loading fullscreen owner="my history page" />
						) : (
							renderEmptyMessage()
						)}
					</div>
				)}
				{currentDetailVisit && (
					<VisitDetailBlade
						isOpen={isVisitDetailBladeOpen}
						onClose={() => setIsDetailBladeOpen(false)}
						visit={currentDetailVisit}
					/>
				)}
			</AccountLayout>
		);
	};

	return (
		<VisitorLayout>
			{renderOgTags(
				tText('pages/account/mijn-bezoek-historiek/index___mijn-bezoek-historiek'),
				tText(
					'pages/account/mijn-bezoek-historiek/index___mijn-bezoek-historiek-meta-omschrijving'
				),
				url
			)}
			<PermissionsCheck allPermissions={[Permission.MANAGE_ACCOUNT]}>
				{renderPageContent()}
			</PermissionsCheck>
		</VisitorLayout>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(AccountMyHistory as ComponentType, true);
