import { Table } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Column, TableOptions } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import {
	CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG,
	requestStatusFilters,
	RequestTablePageSize,
	VISIT_REQUEST_ID_QUERY_KEY,
} from '@cp/const/requests.const';
import {
	PaginationBar,
	ProcessRequestBlade,
	ScrollableTabs,
	SearchBar,
	sortingIcons,
} from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { useHasAnyPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';
import { OrderDirection, Visit, VisitStatus } from '@shared/types';
import { useGetVisit } from '@visits/hooks/get-visit';
import { useGetVisits } from '@visits/hooks/get-visits';
import { RequestStatusAll } from '@visits/types';

import { VisitRequestOverviewProps } from './VisitRequestsOverview.types';

const VisitRequestOverview: FC<VisitRequestOverviewProps> = ({ columns }) => {
	const { t } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG);
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
		isFetching,
	} = useGetVisits({
		searchInput: filters.search,
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
				.then((response) => {
					if (response) {
						setSelectedNotOnCurrentPage(response);
					}
				})
				.catch(() => {
					setFilters({ [VISIT_REQUEST_ID_QUERY_KEY]: undefined });
					setSelectedNotOnCurrentPage(undefined);
					toastService.notify({
						title: t('pages/beheer/aanvragen/index___error'),
						description: t('pages/beheer/aanvragen/index___deze-aanvraag-bestaat-niet'),
					});
				});
		}
	}, [visits, setFilters, getVisit, t, selectedOnCurrentPage, filters]);

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

	const onSortChange = useCallback(
		(rules) => {
			setFilters({
				...filters,
				orderProp: rules[0]?.id || undefined,
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

	const onRowClick = useCallback(
		(e, row) => {
			if (!canUpdateVisitRequests) {
				toastService.notify({
					title: t('pages/beheer/aanvragen/index___geen-rechten'),
					description: t(
						'pages/beheer/aanvragen/index___je-hebt-geen-rechten-om-bezoekaanvragen-te-bewerken'
					),
				});
				return;
			}
			const request = (row as { original: Visit }).original;
			setFilters({ [VISIT_REQUEST_ID_QUERY_KEY]: request.id });
		},
		[canUpdateVisitRequests, setFilters, t]
	);

	// Render

	const renderEmptyMessage = (): string => {
		switch (filters.status) {
			case VisitStatus.APPROVED:
				return t('pages/beheer/aanvragen/index___er-zijn-geen-goedgekeurde-aanvragen');

			case VisitStatus.DENIED:
				return t('pages/beheer/aanvragen/index___er-zijn-geen-geweigerde-aanvragen');

			case VisitStatus.CANCELLED_BY_VISITOR:
				return t('pages/beheer/aanvragen/index___er-zijn-geen-geannuleerde-aanvragen');

			case VisitStatus.PENDING:
			default:
				return t('pages/beheer/aanvragen/index___er-zijn-geen-openstaande-aanvragen');
		}
	};

	return (
		<>
			<div className="l-container">
				<div className="p-cp-requests__header">
					<SearchBar
						default={filters[SEARCH_QUERY_KEY]}
						className="p-cp-requests__search"
						placeholder={t('pages/beheer/aanvragen/index___zoek')}
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

			{(visits?.items?.length || 0) > 0 ? (
				<div className="l-container l-container--edgeless-to-lg">
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
			) : (
				<div className="l-container l-container--edgeless-to-lg u-text-center u-color-neutral u-py-48">
					{isFetching ? t('pages/beheer/aanvragen/index___laden') : renderEmptyMessage()}
				</div>
			)}

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
