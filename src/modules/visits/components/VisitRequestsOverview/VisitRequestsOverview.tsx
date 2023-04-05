import { OrderDirection, Row, Table } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import {
	CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG,
	requestStatusFilters,
	RequestTablePageSize,
	VISIT_REQUEST_ID_QUERY_KEY,
} from '@cp/const/requests.const';
import {
	Loading,
	PaginationBar,
	ProcessRequestBlade,
	ScrollableTabs,
	SearchBar,
	sortingIcons,
} from '@shared/components';
import { globalLabelKeys, SEARCH_QUERY_KEY } from '@shared/const';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { Visit, VisitStatus } from '@shared/types';
import { useGetVisit } from '@visits/hooks/get-visit';
import { useGetVisits } from '@visits/hooks/get-visits';
import { RequestStatusAll } from '@visits/types';

import { VisitRequestOverviewProps } from './VisitRequestsOverview.types';

const VisitRequestOverview: FC<VisitRequestOverviewProps> = ({ columns }) => {
	const { tHtml, tText } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>(filters[SEARCH_QUERY_KEY] || '');

	const [selectedNotOnCurrentPage, setSelectedNotOnCurrentPage] = useState<Visit | undefined>(
		undefined
	);
	const canUpdateVisitRequests: boolean | null = useHasAnyPermission(
		Permission.APPROVE_DENY_CP_VISIT_REQUESTS,
		Permission.APPROVE_DENY_ALL_VISIT_REQUESTS
	);

	const {
		data: visits,
		refetch,
		isLoading: isLoadingVisitRequests,
	} = useGetVisits({
		searchInput: filters[SEARCH_QUERY_KEY],
		status:
			filters.status === RequestStatusAll.ALL ? undefined : (filters.status as VisitStatus),
		page: filters.page,
		size: RequestTablePageSize,
		orderProp: filters.orderProp as keyof Visit,
		orderDirection: filters.orderDirection as OrderDirection,
	});

	const { mutateAsync: getVisit } = useGetVisit();

	// Computed

	const selectedOnCurrentPage = visits?.items.find(
		(x) => x.id === filters[VISIT_REQUEST_ID_QUERY_KEY]
	);

	// Effects

	useEffect(() => {
		const requestId = filters[VISIT_REQUEST_ID_QUERY_KEY];

		if (visits && !selectedOnCurrentPage && requestId) {
			// Check if visitrequest exists
			getVisit(requestId)
				.then((response: Visit | null) => {
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
	}, [visits, setFilters, getVisit, tHtml, selectedOnCurrentPage, filters]);

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
		if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
			setFilters({
				...filters,
				orderProp,
				orderDirection,
				page: 1,
			});
		}
	};

	const onRowClick = (evt: MouseEvent<HTMLTableRowElement>, row: Row<Visit>) => {
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

			case VisitStatus.PENDING:
			default:
				return tHtml(
					'pages/beheer/toegangsaanvragen/index___er-zijn-geen-openstaande-aanvragen'
				);
		}
	};

	const renderContent = () => {
		if (isLoadingVisitRequests) {
			return <Loading owner="visit request overview" />;
		}
		if ((visits?.items?.length || 0) <= 0) {
			return renderEmptyMessage();
		} else {
			return (
				<div className="l-container l-container--edgeless-to-lg">
					<Table<Visit>
						className="u-mt-24"
						options={{
							columns: columns,
							data: visits?.items || [],
							initialState: {
								pageSize: RequestTablePageSize,
								sortBy: sortFilters,
							} as TableState<Visit>,
						}}
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
		}
	};

	return (
		<>
			<div className="l-container">
				<div className="p-cp-requests__header">
					<SearchBar
						id={globalLabelKeys.adminLayout.title}
						value={search}
						className="p-cp-requests__search"
						placeholder={tText('pages/beheer/toegangsaanvragen/index___zoek')}
						onChange={setSearch}
						onSearch={(value) => setFilters({ [SEARCH_QUERY_KEY]: value, page: 1 })}
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
						isLoadingVisitRequests || (visits?.items?.length || 0) <= 0,
				})}
			>
				{renderContent()}
			</div>

			<ProcessRequestBlade
				isOpen={
					(!!filters[VISIT_REQUEST_ID_QUERY_KEY] && !!selectedOnCurrentPage) ||
					!!selectedNotOnCurrentPage
				}
				selected={selectedOnCurrentPage ?? selectedNotOnCurrentPage}
				onClose={() => {
					setFilters({ [VISIT_REQUEST_ID_QUERY_KEY]: undefined });
					setSelectedNotOnCurrentPage(undefined);
				}}
				onFinish={refetch}
			/>
		</>
	);
};

export default VisitRequestOverview;
