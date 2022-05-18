import { Table } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useCallback, useMemo, useState } from 'react';
import { Column, TableOptions } from 'react-table';
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
import { withI18n } from '@i18n/wrappers';
import {
	ApproveRequestBlade,
	ConfirmationModal,
	PaginationBar,
	ScrollableTabs,
	SearchBar,
	sortingIcons,
} from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import { toastService } from '@shared/services/toast-service';
import { OrderDirection, Visit, VisitStatus } from '@shared/types';
import { createPageTitle } from '@shared/utils';
import { useGetVisits } from '@visits/hooks/get-visits';
import { useUpdateVisitRequest } from '@visits/hooks/update-visit';
import { RequestStatusAll, VisitTimeframe } from '@visits/types';

const CPVisitorsPage: NextPage = () => {
	const { t } = useTranslation();
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
				title: t('pages/beheer/bezoekers/index___de-toegang-is-ingetrokken'),
				description: t(
					'pages/beheer/bezoekers/index___deze-gebruiker-heeft-nu-geen-toegang-meer'
				),
			});
		} catch (err) {
			console.error(err);
			toastService.notify({
				title: t('pages/beheer/bezoekers/index___error'),
				description: t(
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

	const renderEmptyMessage = (): string => {
		switch (filters.timeframe) {
			case RequestStatusAll.ALL:
				return t('pages/beheer/bezoekers/index___er-zijn-nog-geen-bezoekers');

			case VisitTimeframe.ACTIVE:
				return t('pages/beheer/bezoekers/index___er-zijn-geen-actieve-bezoekers');

			case VisitTimeframe.PAST:
			default:
				return t(
					'pages/beheer/bezoekers/index___er-zijn-nog-geen-bezoekers-in-de-historiek'
				);
		}
	};

	return (
		<>
			<Head>
				<title>{createPageTitle(t('pages/beheer/bezoekers/index___bezoekers'))}</title>
				<meta
					name="description"
					content={t('pages/beheer/bezoekers/index___beheer-bezoekers-meta-omschrijving')}
				/>
			</Head>

			<CPAdminLayout
				className="p-cp-visitors"
				contentTitle={t('pages/beheer/bezoekers/index___bezoekers')}
			>
				<div className="l-container">
					<div className="p-cp-visitors__header">
						<SearchBar
							default={filters[SEARCH_QUERY_KEY]}
							className="p-cp-visitors__search"
							placeholder={t('pages/beheer/bezoekers/index___zoek')}
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

				{(visits?.items?.length || 0) > 0 ? (
					<div className="l-container l-container--edgeless-to-lg">
						<Table
							className="u-mt-24 c-table--no-padding-last-column"
							options={
								// TODO: fix type hinting
								/* eslint-disable @typescript-eslint/ban-types */
								{
									columns: VisitorsTableColumns(
										denyVisitRequest,
										editVisitRequest
									) as Column<object>[],
									data: visits?.items || [],
									initialState: {
										pageSize: RequestTablePageSize,
										sortBy: sortFilters,
									},
								} as TableOptions<object>
								/* eslint-enable @typescript-eslint/ban-types */
							}
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
				) : (
					<div className="l-container l-container--edgeless-to-lg u-text-center u-color-neutral u-py-48">
						{isFetching
							? t('pages/beheer/aanvragen/index___laden')
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
					title={t('pages/beheer/bezoekers/index___aanvraag-aanpassen')}
					approveButtonLabel={t('pages/beheer/bezoekers/index___aanpassen')}
					successTitle={t(
						'pages/beheer/bezoekers/index___de-aanpassingen-zijn-opgeslagen'
					)}
					successDescription={t(
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
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(
	withAllRequiredPermissions(CPVisitorsPage, Permission.READ_CP_VISIT_REQUESTS)
);
