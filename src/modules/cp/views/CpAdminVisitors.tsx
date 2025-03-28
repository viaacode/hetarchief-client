import { OrderDirection, PaginationBar, Table } from '@meemoo/react-components';
import { type FC, type ReactNode, useMemo, useState } from 'react';
import type { TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import { RequestTablePageSize } from '@cp/const/requests.const';
import {
	CP_ADMIN_VISITORS_QUERY_PARAM_CONFIG,
	visitorsStatusFilters,
	VisitorsTableColumns,
} from '@cp/const/visitors.const';
import { CPAdminLayout } from '@cp/layouts';
import { ApproveRequestBlade } from '@shared/components/ApproveRequestBlade';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { Loading } from '@shared/components/Loading';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SearchBar } from '@shared/components/SearchBar';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { sortingIcons } from '@shared/components/Table';
import { ScrollableTabs } from '@shared/components/Tabs';
import { globalLabelKeys } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { type VisitRequest, VisitStatus } from '@shared/types/visit-request';
import { useGetVisitRequests } from '@visit-requests/hooks/get-visit-requests';
import { useUpdateVisitRequest } from '@visit-requests/hooks/update-visit';
import { RequestStatusAll, VisitTimeframe } from '@visit-requests/types';

export const CpAdminVisitorsPage: FC<DefaultSeoInfo> = ({ url }) => {
	const [filters, setFilters] = useQueryParams(CP_ADMIN_VISITORS_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || '');

	const [showDenyVisitRequestModal, setShowDenyVisitRequestModal] = useState<boolean>(false);
	const [showEditVisitRequestModal, setShowEditVisitRequestModal] = useState<boolean>(false);
	const [selected, setSelected] = useState<string | number | null>(null);

	const {
		data: visits,
		isFetching,
		refetch: refetchVisitRequests,
	} = useGetVisitRequests({
		searchInput: filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY],
		status: VisitStatus.APPROVED,
		timeframe:
			filters.timeframe === RequestStatusAll.ALL
				? undefined
				: (filters.timeframe as VisitTimeframe),
		page: filters.page,
		size: RequestTablePageSize,
		orderProp: filters.orderProp as keyof VisitRequest,
		orderDirection: filters.orderDirection as OrderDirection,
	});

	const { mutateAsync: updateVisitRequest } = useUpdateVisitRequest();
	const selectedItem = useMemo(
		() => visits?.items.find((item) => item.id === selected),
		[selected, visits?.items]
	);

	// Filters

	const statusFilters = useMemo(
		() =>
			visitorsStatusFilters().map((filter) => {
				return {
					...filter,
					active: filter.id === filters.timeframe,
				};
			}),
		[filters.timeframe]
	);

	const sortFilters = useMemo(() => {
		return [
			{
				id: filters.orderProp,
				desc: filters.orderDirection !== OrderDirection.asc,
			},
		];
	}, [filters.orderProp, filters.orderDirection]);

	// Events

	const onSortChange = (
		orderProp: string | undefined,
		orderDirection: OrderDirection | undefined
	) => {
		if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
			setFilters({
				...filters,
				orderProp: orderProp || 'startAt',
				orderDirection: orderDirection || OrderDirection.desc,
				page: 1,
			});
		}
	};

	const denyVisitRequest = (visitRequest: VisitRequest) => {
		setSelected(visitRequest.id);
		setShowDenyVisitRequestModal(true);
	};

	const editVisitRequest = (visitRequest: VisitRequest) => {
		setSelected(visitRequest.id);
		setShowEditVisitRequestModal(true);
	};

	const handleDenyVisitRequestConfirmed = async () => {
		try {
			setShowDenyVisitRequestModal(false);
			if (!selected) {
				return;
			}
			await updateVisitRequest({
				id: selected.toString(),
				updatedProps: { status: VisitStatus.DENIED },
			});
			await refetchVisitRequests();
			toastService.notify({
				title: tHtml('pages/beheer/bezoekers/index___de-toegang-is-ingetrokken'),
				description: tHtml(
					'pages/beheer/bezoekers/index___deze-gebruiker-heeft-nu-geen-toegang-meer'
				),
			});
		} catch (err) {
			console.error(err);
			toastService.notify({
				title: tHtml('pages/beheer/bezoekers/index___error'),
				description: tHtml(
					'pages/beheer/bezoekers/index___het-updaten-van-de-bezoekersaanvraag-is-mislukt'
				),
			});
		}
	};

	const handleEditVisitRequestFinished = async () => {
		setSelected(null);
		setShowEditVisitRequestModal(false);
		await refetchVisitRequests();
	};

	// Render

	const renderEmptyMessage = (): string | ReactNode => {
		switch (filters.timeframe) {
			case RequestStatusAll.ALL:
				return tHtml('pages/beheer/bezoekers/index___er-zijn-nog-geen-bezoekers');

			case VisitTimeframe.ACTIVE:
				return tHtml('pages/beheer/bezoekers/index___er-zijn-geen-actieve-bezoekers');

			// case VisitTimeframe.PAST:
			default:
				return tHtml(
					'pages/beheer/bezoekers/index___er-zijn-nog-geen-bezoekers-in-de-bezoek-historiek'
				);
		}
	};

	const renderVisitorsTable = () => {
		if (isFetching) {
			return (
				<div className="l-container l-container--edgeless-to-lg u-text-center u-color-neutral u-py-48">
					<Loading owner="admin visitors page: table loading" fullscreen />
				</div>
			);
		}
		if ((visits?.items?.length || 0) <= 0) {
			return (
				<div className="l-container l-container--edgeless-to-lg u-text-center u-color-neutral u-py-48">
					{renderEmptyMessage()}
				</div>
			);
		}
		return (
			<div className="l-container l-container--edgeless-to-lg">
				<Table<VisitRequest>
					className="u-mt-24 c-table--no-padding-last-column"
					options={{
						columns: VisitorsTableColumns(denyVisitRequest, editVisitRequest),
						data: visits?.items || [],
						initialState: {
							pageSize: RequestTablePageSize,
							sortBy: sortFilters,
						} as TableState<VisitRequest>,
					}}
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
									// setSelected(null);
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
		);
	};

	const renderPageContent = () => {
		return (
			<CPAdminLayout
				className="p-cp-visitors"
				pageTitle={tText('pages/beheer/bezoekers/index___bezoekers')}
			>
				<div className="l-container">
					<div className="p-cp-visitors__header">
						<SearchBar
							id={globalLabelKeys.adminLayout.title}
							value={search}
							className="p-cp-visitors__search"
							placeholder={tText('pages/beheer/bezoekers/index___zoek')}
							onChange={setSearch}
							onSearch={(value) =>
								setFilters({
									[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: value || undefined,
								})
							}
						/>

						<ScrollableTabs
							className="p-cp-visitors__status-filter"
							tabs={statusFilters}
							variants={['rounded', 'light', 'bordered', 'medium']}
							onClick={(tabId) =>
								setFilters({
									timeframe: tabId.toString(),
									page: 1,
								})
							}
						/>
					</div>
				</div>

				{renderVisitorsTable()}

				<ConfirmationModal
					isOpen={showDenyVisitRequestModal}
					onClose={() => {
						setSelected(null);
						setShowDenyVisitRequestModal(false);
					}}
					onConfirm={handleDenyVisitRequestConfirmed}
					onCancel={() => {
						setSelected(null);
						setShowDenyVisitRequestModal(false);
					}}
				/>
				<ApproveRequestBlade
					title={tHtml('pages/beheer/bezoekers/index___aanvraag-aanpassen')}
					approveButtonLabel={tText('pages/beheer/bezoekers/index___aanpassen')}
					successTitle={tHtml('pages/beheer/bezoekers/index___de-aanpassingen-zijn-opgeslagen')}
					successDescription={tHtml(
						'pages/beheer/bezoekers/index___de-aanpassingen-aan-de-bezoekersaanvraag-zijn-opgeslagen'
					)}
					isOpen={showEditVisitRequestModal}
					selected={selectedItem}
					onClose={() => {
						setSelected(null);
						setShowEditVisitRequestModal(false);
					}}
					onSubmit={handleEditVisitRequestFinished}
					id="visitors-page__approve-request-blade"
				/>
			</CPAdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title={`${tText('pages/beheer/bezoekers/index___bezoekers')} | ${tText('modules/cp/views/cp-admin-visitors___beheer')}`}
				description={tText('pages/beheer/bezoekers/index___beheer-bezoekers-meta-omschrijving')}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<PermissionsCheck allPermissions={[Permission.MANAGE_CP_VISIT_REQUESTS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
