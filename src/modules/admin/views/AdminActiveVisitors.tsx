import { OrderDirection, Table } from '@meemoo/react-components';
import React, { type FC, type ReactNode, useMemo, useState } from 'react';
import { type TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import {
	ADMIN_VISITORS_QUERY_PARAM_CONFIG,
	VisitorsTableColumns,
	VisitorsTablePageSize,
} from '@admin/const/Visitors.const';
import { AdminLayout } from '@admin/layouts';
import { ApproveRequestBlade } from '@shared/components/ApproveRequestBlade';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { PaginationBar } from '@shared/components/PaginationBar';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SearchBar } from '@shared/components/SearchBar';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { sortingIcons } from '@shared/components/Table';
import { globalLabelKeys } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { toastService } from '@shared/services/toast-service';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { type VisitRequest, VisitStatus } from '@shared/types/visit-request';
import { useGetVisitRequests } from '@visit-requests/hooks/get-visit-requests';
import { useUpdateVisitRequest } from '@visit-requests/hooks/update-visit';
import { VisitTimeframe } from '@visit-requests/types';

export const AdminActiveVisitors: FC<DefaultSeoInfo> = ({ url }) => {
	const [filters, setFilters] = useQueryParams(ADMIN_VISITORS_QUERY_PARAM_CONFIG);
	const [showDenyVisitRequestModal, setShowDenyVisitRequestModal] = useState<boolean>(false);
	const [showEditVisitRequestModal, setShowEditVisitRequestModal] = useState<boolean>(false);
	const [selected, setSelected] = useState<string | number | null>(null);

	const {
		data: visitRequests,
		isFetching,
		refetch: refetchVisitRequests,
	} = useGetVisitRequests({
		searchInput: filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY],
		timeframe: VisitTimeframe.ACTIVE,
		status: VisitStatus.APPROVED,
		page: filters.page,
		size: VisitorsTablePageSize,
		orderProp: filters.orderProp as keyof VisitRequest,
		orderDirection: filters.orderDirection as OrderDirection,
	});
	const [search, setSearch] = useState<string>('');
	const { mutateAsync: updateVisitRequest } = useUpdateVisitRequest();
	const selectedItem = useMemo(
		() => visitRequests?.items.find((item) => item.id === selected),
		[visitRequests, selected]
	);

	// Filters
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
		return tHtml(
			'modules/admin/visitor-spaces/pages/visitors/visitors___er-zijn-geen-actieve-bezoekers'
		);
	};

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tText(
					'pages/admin/bezoekersruimtesbeheer/bezoekers/index___actieve-bezoekers'
				)}
			>
				<AdminLayout.Content>
					<div className="p-admin-visitors l-container">
						<div className="p-admin-visitors__header">
							<SearchBar
								aria-label={tText('zoekveld aria label')}
								id={globalLabelKeys.adminLayout.title}
								value={search}
								className="p-admin-visitors__search"
								placeholder={tText(
									'pages/admin/bezoekersruimtesbeheer/bezoekers/index___zoek'
								)}
								onChange={setSearch}
								onSearch={(value) =>
									setFilters({
										[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: value,
										page: 1,
									})
								}
							/>
						</div>

						{(visitRequests?.items?.length || 0) > 0 ? (
							<div className="l-container--edgeless-to-lg">
								<Table<VisitRequest>
									className="u-mt-24 c-table--no-padding-last-column"
									options={{
										columns: VisitorsTableColumns(
											denyVisitRequest,
											editVisitRequest
										),
										data: visitRequests?.items || [],
										initialState: {
											pageSize: VisitorsTablePageSize,
											sortBy: sortFilters,
										} as TableState<VisitRequest>,
									}}
									onSortChange={onSortChange}
									sortingIcons={sortingIcons}
									pagination={({ gotoPage }) => {
										return (
											<PaginationBar
												className="u-mt-16 u-mb-16"
												count={VisitorsTablePageSize}
												start={
													Math.max(0, filters.page - 1) *
													VisitorsTablePageSize
												}
												total={visitRequests?.total || 0}
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
						) : (
							<div className="l-container l-container--edgeless-to-lg u-text-center u-color-neutral u-py-48">
								{isFetching
									? tHtml(
											'modules/admin/visitor-spaces/pages/visitors/visitors___laden'
									  )
									: renderEmptyMessage()}
							</div>
						)}
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
							successTitle={tHtml(
								'pages/beheer/bezoekers/index___de-aanpassingen-zijn-opgeslagen'
							)}
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
							id="active-visitors-page__approve-request-blade"
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title={tText(
					'pages/admin/bezoekersruimtesbeheer/bezoekers/index___actieve-bezoekers'
				)}
				description={tText(
					'pages/admin/bezoekersruimtesbeheer/bezoekers/index___actieve-bezoekers-meta-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<PermissionsCheck allPermissions={[Permission.MANAGE_ALL_VISIT_REQUESTS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
