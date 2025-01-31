import { OrderDirection, PaginationBar, type Row, Table } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, type MouseEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import type { TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import {
	CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG,
	requestStatusFilters,
	RequestTablePageSize,
	VISIT_REQUEST_ID_QUERY_KEY,
} from '@cp/const/requests.const';
import { Loading } from '@shared/components/Loading';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import ProcessRequestBlade from '@shared/components/ProcessRequestBlade/ProcessRequestBlade';
import { SearchBar } from '@shared/components/SearchBar';
import { sortingIcons } from '@shared/components/Table';
import { ScrollableTabs } from '@shared/components/Tabs';
import { globalLabelKeys } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';
import { type VisitRequest, VisitStatus } from '@shared/types/visit-request';
import { useGetVisitRequest } from '@visit-requests/hooks/get-visit-request';
import { useGetVisitRequests } from '@visit-requests/hooks/get-visit-requests';
import { RequestStatusAll } from '@visit-requests/types';

import type { VisitRequestOverviewProps } from './VisitRequestsOverview.types';

const VisitRequestOverview: FC<VisitRequestOverviewProps> = ({ columns }) => {
	const [filters, setFilters] = useQueryParams(CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || '');

	const [selectedNotOnCurrentPage, setSelectedNotOnCurrentPage] = useState<
		VisitRequest | undefined
	>(undefined);
	const canUpdateVisitRequests: boolean | null = useHasAnyPermission(
		Permission.MANAGE_CP_VISIT_REQUESTS,
		Permission.MANAGE_ALL_VISIT_REQUESTS
	);

	const {
		data: visits,
		refetch,
		isLoading: isLoadingVisitRequests,
	} = useGetVisitRequests({
		searchInput: filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY],
		status:
			filters.status === RequestStatusAll.ALL ? undefined : (filters.status as VisitStatus),
		page: filters.page,
		size: RequestTablePageSize,
		orderProp: filters.orderProp as keyof VisitRequest,
		orderDirection: filters.orderDirection as OrderDirection,
	});

	const { mutateAsync: getVisitRequest } = useGetVisitRequest();

	// Don't show hardcoded access
	const filteredVisits = visits?.items.filter((visit) => !visit.id.includes('permanent-id'));

	// Computed

	const selectedOnCurrentPage = filteredVisits?.find(
		(x) => x.id === filters[VISIT_REQUEST_ID_QUERY_KEY]
	);

	// Effects

	useEffect(() => {
		const requestId = filters[VISIT_REQUEST_ID_QUERY_KEY];

		if (filteredVisits && !selectedOnCurrentPage && requestId) {
			// Check if visit request exists
			getVisitRequest(requestId)
				.then((response: VisitRequest | null) => {
					if (response) {
						setSelectedNotOnCurrentPage(response);
					}
				})
				.catch(() => {
					setFilters({ [VISIT_REQUEST_ID_QUERY_KEY]: undefined });
					setSelectedNotOnCurrentPage(undefined);
					toastService.notify({
						title: tHtml('pages/beheer/toegangsaanvragen/index___error'),
						description: tHtml(
							'pages/beheer/toegangsaanvragen/index___deze-aanvraag-bestaat-niet'
						),
					});
				});
		}
	}, [filteredVisits, setFilters, getVisitRequest, selectedOnCurrentPage, filters]);

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

	const onSortChange = (
		orderProp: string | undefined,
		orderDirection: OrderDirection | undefined
	) => {
		if (!orderProp) {
			orderProp = 'startAt';
		}
		if (!orderDirection) {
			orderDirection = OrderDirection.desc;
		}
		if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
			setFilters({
				...filters,
				orderProp,
				orderDirection,
				page: 1,
			});
		}
	};

	const onRowClick = (_evt: MouseEvent<HTMLTableRowElement>, row: Row<VisitRequest>) => {
		if (!canUpdateVisitRequests) {
			toastService.notify({
				title: tHtml('pages/beheer/toegangsaanvragen/index___geen-rechten'),
				description: tHtml(
					'pages/beheer/toegangsaanvragen/index___je-hebt-geen-rechten-om-bezoekaanvragen-te-bewerken'
				),
			});
			return;
		}
		const request = row.original;
		setFilters({ [VISIT_REQUEST_ID_QUERY_KEY]: request.id });
	};

	// Render

	const renderEmptyMessage = (): string | ReactNode => {
		switch (filters.status) {
			case VisitStatus.APPROVED:
				return tHtml(
					'pages/beheer/toegangsaanvragen/index___er-zijn-geen-goedgekeurde-aanvragen'
				);

			case VisitStatus.DENIED:
				return tHtml(
					'pages/beheer/toegangsaanvragen/index___er-zijn-geen-geweigerde-aanvragen'
				);

			case VisitStatus.CANCELLED_BY_VISITOR:
				return tHtml(
					'pages/beheer/toegangsaanvragen/index___er-zijn-geen-geannuleerde-aanvragen'
				);
			default:
				return tHtml(
					'pages/beheer/toegangsaanvragen/index___er-zijn-geen-openstaande-aanvragen'
				);
		}
	};

	const renderContent = () => {
		if (isLoadingVisitRequests) {
			return <Loading owner="visit request overview" fullscreen />;
		}
		if ((filteredVisits?.length || 0) <= 0) {
			return renderEmptyMessage();
		}
			return (
				<div className="l-container l-container--edgeless-to-lg">
					<Table<VisitRequest>
						className="u-mt-24"
						options={{
							columns: columns,
							data: filteredVisits || [],
							initialState: {
								pageSize: RequestTablePageSize,
								sortBy: sortFilters,
							} as TableState<VisitRequest>,
						}}
						onRowClick={onRowClick}
						onSortChange={onSortChange}
						sortingIcons={sortingIcons}
						pagination={({ gotoPage }) => {
							return (
								<PaginationBar
									{...getDefaultPaginationBarProps()}
									itemsPerPage={RequestTablePageSize}
									startItem={Math.max(0, filters.page - 1) * RequestTablePageSize}
									totalItems={visits?.total || 0}
									onPageChange={(pageZeroBased) => {
										gotoPage(pageZeroBased);
										setFilters({
											...filters,
											page: pageZeroBased + 1,
											[VISIT_REQUEST_ID_QUERY_KEY]: undefined,
										});
										setSelectedNotOnCurrentPage(undefined);
									}}
								/>
							);
						}}
					/>
				</div>
			);
	};

	return (
		<>
			<div className="l-container">
				<div className="p-cp-requests__header">
					<SearchBar
						aria-label={tText(
							'modules/visit-requests/components/visit-requests-overview/visit-requests-overview___zoekbalk-aria-label'
						)}
						id={globalLabelKeys.adminLayout.title}
						value={search}
						className="p-cp-requests__search"
						placeholder={tText('pages/beheer/toegangsaanvragen/index___zoek')}
						onChange={setSearch}
						onSearch={(value) =>
							setFilters({ [QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: value, page: 1 })
						}
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

			<div
				className={clsx('l-container l-container--edgeless-to-lg', {
					'u-text-center u-color-neutral u-py-48':
						isLoadingVisitRequests || (filteredVisits?.length || 0) <= 0,
				})}
			>
				{renderContent()}
			</div>

			<ProcessRequestBlade
				isOpen={
					!!filters[VISIT_REQUEST_ID_QUERY_KEY] &&
					(!!selectedOnCurrentPage || !!selectedNotOnCurrentPage)
				}
				selected={selectedOnCurrentPage ?? selectedNotOnCurrentPage}
				onClose={() => {
					setFilters({ [VISIT_REQUEST_ID_QUERY_KEY]: undefined });
					setSelectedNotOnCurrentPage(undefined);
				}}
				onFinish={refetch}
				id="visit-request-overview__process-request-blade"
			/>
		</>
	);
};

export default VisitRequestOverview;
