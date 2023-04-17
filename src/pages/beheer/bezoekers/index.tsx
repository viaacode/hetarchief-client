import { OrderDirection, Table } from '@meemoo/react-components';
import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, ReactNode, useMemo, useState } from 'react';
import { TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import { RequestTablePageSize } from '@cp/const/requests.const';
import {
	CP_ADMIN_VISITORS_QUERY_PARAM_CONFIG,
	visitorsStatusFilters,
	VisitorsTableColumns,
} from '@cp/const/visitors.const';
import { CPAdminLayout } from '@cp/layouts';
import {
	ApproveRequestBlade,
	ConfirmationModal,
	Loading,
	PaginationBar,
	ScrollableTabs,
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
import { RequestStatusAll, VisitTimeframe } from '@visits/types';

const CPVisitorsPage: NextPage<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();
	const [filters, setFilters] = useQueryParams(CP_ADMIN_VISITORS_QUERY_PARAM_CONFIG);
	const [showDenyVisitRequestModal, setShowDenyVisitRequestModal] = useState<boolean>(false);
	const [showEditVisitRequestModal, setShowEditVisitRequestModal] = useState<boolean>(false);
	const [selected, setSelected] = useState<string | number | null>(null);

	const {
		data: visits,
		isFetching,
		refetch: refetchVisitRequests,
	} = useGetVisits({
		searchInput: filters.search,
		status: VisitStatus.APPROVED,
		timeframe:
			filters.timeframe === RequestStatusAll.ALL
				? undefined
				: (filters.timeframe as VisitTimeframe),
		page: filters.page,
		size: RequestTablePageSize,
		orderProp: filters.orderProp as keyof Visit,
		orderDirection: filters.orderDirection as OrderDirection,
	});

	const { mutateAsync: updateVisitRequest } = useUpdateVisitRequest();
	const selectedItem = useMemo(
		() => visits?.items.find((item) => item.id === selected),
		[visits, selected]
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
		switch (filters.timeframe) {
			case RequestStatusAll.ALL:
				return tHtml('pages/beheer/bezoekers/index___er-zijn-nog-geen-bezoekers');

			case VisitTimeframe.ACTIVE:
				return tHtml('pages/beheer/bezoekers/index___er-zijn-geen-actieve-bezoekers');

			case VisitTimeframe.PAST:
			default:
				return tHtml(
					'pages/beheer/bezoekers/index___er-zijn-nog-geen-bezoekers-in-de-historiek'
				);
		}
	};

	const renderVisitorsTable = () => {
		if (isFetching) {
			return (
				<div className="l-container l-container--edgeless-to-lg u-text-center u-color-neutral u-py-48">
					<Loading owner="admin visitors page: table loading" />
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
				<Table<Visit>
					className="u-mt-24 c-table--no-padding-last-column"
					options={{
						columns: VisitorsTableColumns(denyVisitRequest, editVisitRequest),
						data: visits?.items || [],
						initialState: {
							pageSize: RequestTablePageSize,
							sortBy: sortFilters,
						} as TableState<Visit>,
					}}
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
							default={filters[SEARCH_QUERY_KEY]}
							className="p-cp-visitors__search"
							placeholder={tText('pages/beheer/bezoekers/index___zoek')}
							onSearch={(value) => setFilters({ [SEARCH_QUERY_KEY]: value })}
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
			</CPAdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/beheer/bezoekers/index___bezoekers'),
				tText('pages/beheer/bezoekers/index___beheer-bezoekers-meta-omschrijving'),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.READ_CP_VISIT_REQUESTS]}>
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

export default withAuth(CPVisitorsPage as ComponentType, true);
