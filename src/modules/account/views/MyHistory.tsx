import { OrderDirection, PaginationBar, Table } from '@meemoo/react-components';
import { useRouter } from 'next/router';
import { type FC, type MouseEvent, type ReactNode, useMemo, useState } from 'react';
import { type Row, type TableState } from 'react-table';
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
import { ErrorNoAccess } from '@shared/components/ErrorNoAccess';
import { Loading } from '@shared/components/Loading';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { sortingIcons } from '@shared/components/Table';
import { VisitDetailBlade } from '@shared/components/VisitDetailBlade';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { AccessStatus, type VisitRequest } from '@shared/types/visit-request';
import { createVisitorSpacesWithFilterUrl } from '@shared/utils/create-url';
import { useGetVisitAccessStatusMutation } from '@visit-requests/hooks/get-visit-access-status';
import { useGetVisitRequests } from '@visit-requests/hooks/get-visit-requests';
import { VisitorLayout } from '@visitor-layout/index';
import { SearchFilterId } from '@visitor-space/types';

export const AccountMyHistory: FC<DefaultSeoInfo> = ({ url }) => {
	const router = useRouter();
	const locale = useLocale();
	const [filters, setFilters] = useQueryParams(ACCOUNT_HISTORY_QUERY_PARAM_CONFIG);
	const [currentDetailVisit, setCurrentDetailVisit] = useState<VisitRequest | null>(null);
	const [isVisitDetailBladeOpen, setIsDetailBladeOpen] = useState(false);

	const hasAccountHistoryPerm = useHasAnyPermission(
		Permission.READ_PERSONAL_APPROVED_VISIT_REQUESTS
	);

	const visits = useGetVisitRequests({
		searchInput: undefined,
		page: filters.page,
		size: HistoryItemListSize,
		orderProp: filters.orderProp as keyof VisitRequest,
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

	const onClickRow = async (visit: VisitRequest) => {
		try {
			const response = await getAccessStatus(visit.spaceSlug);
			switch (response?.status) {
				case AccessStatus.ACCESS:
					router.push(
						`${ROUTES_BY_LOCALE[locale].search}?${SearchFilterId.Maintainer}=${visit.spaceSlug}`
					);
					break;
				case AccessStatus.PENDING:
					router.push(
						ROUTES_BY_LOCALE[locale].visitRequested.replace(':slug', visit.spaceSlug)
					);
					break;
				default:
					router.push(createVisitorSpacesWithFilterUrl(visit, locale));
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
			router.push(createVisitorSpacesWithFilterUrl(visit, locale));
		}
	};

	const onRowClick = (evt: MouseEvent<HTMLTableRowElement>, row: Row<VisitRequest>) => {
		setCurrentDetailVisit(row.original);
		setIsDetailBladeOpen(true);
	};

	// Render

	const renderEmptyMessage = (): string | ReactNode => {
		return tHtml('pages/account/mijn-bezoek-historiek/index___geen-bezoek-historiek');
	};

	const renderPageContent = () => {
		if (!hasAccountHistoryPerm) {
			return (
				<ErrorNoAccess
					visitorSpaceSlug={null}
					description={tHtml(
						'modules/shared/components/error-no-access/error-no-access___je-hebt-geen-toegang-tot-deze-pagina'
					)}
				/>
			);
		}
		return (
			<AccountLayout
				className="p-account-my-history"
				pageTitle={tText(
					'pages/account/mijn-bezoek-historiek/index___mijn-bezoek-historiek'
				)}
			>
				{(filteredVisits?.length || 0) > 0 ? (
					<div className="l-container l-container--edgeless-to-lg">
						<Table<VisitRequest>
							className="u-mt-24"
							style={{ cursor: 'pointer' }}
							onRowClick={onRowClick}
							options={{
								columns: HistoryTableColumns(onClickRow),
								data: filteredVisits || [],
								initialState: {
									pageSize: HistoryItemListSize,
									sortBy: sortFilters,
								} as TableState<VisitRequest>,
							}}
							onSortChange={onSortChange}
							sortingIcons={sortingIcons}
							pagination={({ gotoPage }) => {
								return (
									<PaginationBar
										{...getDefaultPaginationBarProps()}
										count={HistoryItemListSize}
										start={Math.max(0, filters.page - 1) * HistoryItemListSize}
										total={visits.data?.total || 0}
										onPageChange={(pageZeroBased: number) => {
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
			<SeoTags
				title={tText('pages/account/mijn-bezoek-historiek/index___mijn-bezoek-historiek')}
				description={tText(
					'pages/account/mijn-bezoek-historiek/index___mijn-bezoek-historiek-meta-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>
			<PermissionsCheck allPermissions={[Permission.MANAGE_ACCOUNT]}>
				{renderPageContent()}
			</PermissionsCheck>
		</VisitorLayout>
	);
};
