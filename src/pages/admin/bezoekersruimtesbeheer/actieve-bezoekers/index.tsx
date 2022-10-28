import { OrderDirection, Table } from '@meemoo/react-components';
import { GetServerSidePropsResult } from 'next';
import getConfig from 'next/config';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC, ReactNode, useMemo, useState } from 'react';
import { TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import {
	ADMIN_VISITORS_QUERY_PARAM_CONFIG,
	VisitorsTableColumns,
	VisitorsTablePageSize,
} from '@admin/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	ApproveRequestBlade,
	ConfirmationModal,
	PaginationBar,
	SearchBar,
	sortingIcons,
} from '@shared/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { globalLabelKeys, SEARCH_QUERY_KEY } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { Visit, VisitStatus } from '@shared/types';
import { DefaultSeoInfo } from '@shared/types/seo';
import { useGetVisits } from '@visits/hooks/get-visits';
import { useUpdateVisitRequest } from '@visits/hooks/update-visit';
import { VisitTimeframe } from '@visits/types';

const Visitors: FC<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();
	const [filters, setFilters] = useQueryParams(ADMIN_VISITORS_QUERY_PARAM_CONFIG);
	const [showDenyVisitRequestModal, setShowDenyVisitRequestModal] = useState<boolean>(false);
	const [showEditVisitRequestModal, setShowEditVisitRequestModal] = useState<boolean>(false);
	const [selected, setSelected] = useState<string | number | null>(null);

	const {
		data: visits,
		isFetching,
		refetch: refetchVisitRequests,
	} = useGetVisits({
		searchInput: filters.search,
		timeframe: VisitTimeframe.ACTIVE,
		status: VisitStatus.APPROVED,
		page: filters.page,
		size: VisitorsTablePageSize,
		orderProp: filters.orderProp as keyof Visit,
		orderDirection: filters.orderDirection as OrderDirection,
	});

	const { mutateAsync: updateVisitRequest } = useUpdateVisitRequest();
	const selectedItem = useMemo(
		() => visits?.items.find((item) => item.id === selected),
		[visits, selected]
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
		if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
			setFilters({
				...filters,
				orderProp,
				orderDirection,
				page: 1,
			});
		}
	};

	const denyVisitRequest = (visitRequest: Visit) => {
		setSelected(visitRequest.id);
		setShowDenyVisitRequestModal(true);
	};

	const editVisitRequest = (visitRequest: Visit) => {
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
				pageTitle={tHtml(
					'pages/admin/bezoekersruimtesbeheer/bezoekers/index___actieve-bezoekers'
				)}
			>
				<AdminLayout.Content>
					<div className="p-admin-visitors l-container">
						<div className="p-admin-visitors__header">
							<SearchBar
								id={globalLabelKeys.adminLayout.title}
								default={filters[SEARCH_QUERY_KEY]}
								className="p-admin-visitors__search"
								placeholder={tText(
									'pages/admin/bezoekersruimtesbeheer/bezoekers/index___zoek'
								)}
								onSearch={(value) =>
									setFilters({ [SEARCH_QUERY_KEY]: value, page: 1 })
								}
							/>
						</div>

						{(visits?.items?.length || 0) > 0 ? (
							<div className="l-container--edgeless-to-lg">
								<Table<Visit>
									className="u-mt-24 c-table--no-padding-last-column"
									options={{
										columns: VisitorsTableColumns(
											denyVisitRequest,
											editVisitRequest
										),
										data: visits?.items || [],
										initialState: {
											pageSize: VisitorsTablePageSize,
											sortBy: sortFilters,
										} as TableState<Visit>,
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
												total={visits?.total || 0}
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
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/admin/bezoekersruimtesbeheer/bezoekers/index___actieve-bezoekers'),
				tText(
					'pages/admin/bezoekersruimtesbeheer/bezoekers/index___actieve-bezoekers-meta-omschrijving'
				),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.READ_ALL_VISIT_REQUESTS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(Visitors as ComponentType);
