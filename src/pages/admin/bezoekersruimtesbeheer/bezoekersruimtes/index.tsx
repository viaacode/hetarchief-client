import { Button, Column, Table, TableOptions } from '@meemoo/react-components';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useMemo } from 'react';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import {
	ADMIN_VISITOR_SPACES_OVERVIEW_QUERY_PARAM_CONFIG,
	VisitorSpacesOverviewTableColumns,
	VisitorSpacesOverviewTablePageSize,
} from '@admin/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import {
	Icon,
	Loading,
	PaginationBar,
	ScrollableTabs,
	SearchBar,
	sortingIcons,
} from '@shared/components';
import { ROUTE_PARTS, SEARCH_QUERY_KEY } from '@shared/const';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';
import { OrderDirection } from '@shared/types';
import { createPageTitle } from '@shared/utils';
import { VisitorSpaceStatusOptions } from '@visitor-space/const';
import { useGetVisitorSpaces } from '@visitor-space/hooks/get-visitor-spaces';
import { VisitorSpaceService } from '@visitor-space/services';
import { VisitorSpaceOrderProps, VisitorSpaceStatus } from '@visitor-space/types';

const VisitorSpacesOverview: FC = () => {
	const { t } = useTranslation();
	const router = useRouter();

	const showCreateButton = useHasAllPermission(Permission.CREATE_SPACES);
	const showEditButton = useHasAllPermission(Permission.UPDATE_ALL_SPACES);
	const showStatusDropdown = useHasAllPermission(Permission.EDIT_ALL_SPACES_STATUS);

	const [filters, setFilters] = useQueryParams(ADMIN_VISITOR_SPACES_OVERVIEW_QUERY_PARAM_CONFIG);

	const {
		data: visitorSpaces,
		isLoading,
		isError,
		refetch,
		isFetching,
	} = useGetVisitorSpaces(
		filters.search,
		filters.status === 'ALL'
			? [VisitorSpaceStatus.Requested, VisitorSpaceStatus.Active, VisitorSpaceStatus.Inactive]
			: ([filters.status] as VisitorSpaceStatus[]),
		filters.page,
		VisitorSpacesOverviewTablePageSize,
		filters.orderProp as VisitorSpaceOrderProps,
		filters.orderDirection as OrderDirection
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

	// Callbacks
	const onFailedRequest = () => {
		refetch();

		toastService.notify({
			maxLines: 3,
			title: t(
				'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-ging-iets-mis'
			),
			description: t(
				'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-is-een-fout-opgetreden-tijdens-het-aanpassen-van-de-status'
			),
		});
	};

	const updateRoomStatus = (roomId: string, status: VisitorSpaceStatus) => {
		VisitorSpaceService.update(roomId, {
			status: status,
		})
			.catch(onFailedRequest)
			.then((response) => {
				if (!response) {
					return;
				}

				refetch();

				toastService.notify({
					maxLines: 3,
					title: t('pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___succes'),
					description: t(
						'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___de-status-werd-succesvol-aangepast'
					),
				});
			});
	};

	const statusFilters = useMemo(
		() =>
			VisitorSpaceStatusOptions().map((filter) => {
				return {
					...filter,
					active: filter.id === filters.status,
				};
			}),
		[filters.status]
	);

	// Render

	const renderEmptyMessage = (): string => {
		switch (filters.status) {
			case VisitorSpaceStatus.Requested:
				return t(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-zijn-geen-bezoekersruimtes-in-aanvraag'
				);

			case VisitorSpaceStatus.Active:
				return t(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-zijn-geen-gepubliceerde-bezoekersruimtes'
				);

			case VisitorSpaceStatus.Inactive:
				return t(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-zijn-geen-gedepubliceerde-bezoekersruimtes'
				);

			default:
				return t(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-zijn-geen-bezoekersruimtes'
				);
		}
	};

	const renderVisitorSpacesTable = () => {
		if (!visitorSpaces?.items?.length) {
			return (
				<div className="l-container l-container--edgeless-to-lg u-text-center u-color-neutral u-py-48">
					{isFetching ? t('pages/beheer/aanvragen/index___laden') : renderEmptyMessage()}
				</div>
			);
		}
		return (
			<Table
				className="u-mt-24"
				options={
					// TODO: fix type hinting
					/* eslint-disable @typescript-eslint/ban-types */
					{
						columns: VisitorSpacesOverviewTableColumns(
							updateRoomStatus,
							showEditButton,
							showStatusDropdown
						) as Column<object>[],
						data: visitorSpaces?.items || [],
						initialState: {
							pageSize: VisitorSpacesOverviewTablePageSize,
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
							count={VisitorSpacesOverviewTablePageSize}
							start={
								Math.max(0, filters.page - 1) * VisitorSpacesOverviewTablePageSize
							}
							total={visitorSpaces?.total || 0}
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
		);
	};

	const renderVisitorSpaces = () => (
		<>
			<div className="p-cp-visitor-spaces__header">
				<SearchBar
					default={filters[SEARCH_QUERY_KEY]}
					className="p-cp-visitor-spaces__search"
					placeholder={t(
						'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___zoek'
					)}
					onSearch={(value) => setFilters({ [SEARCH_QUERY_KEY]: value, page: 1 })}
				/>

				<ScrollableTabs
					className="p-cp-visitor-spaces__status-filter"
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

			<div className="l-container--edgeless-to-lg">{renderVisitorSpacesTable()}</div>
		</>
	);

	const renderPageContent = () => {
		if (isLoading) {
			return <Loading />;
		}
		if (isError) {
			return (
				<p className="p-admin-visitor-spaces__error">
					{t(
						'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-ging-iets-mis-bij-het-ophalen-van-de-bezoekersruimtes'
					)}
				</p>
			);
		}
		if (!visitorSpaces) {
			return (
				<p className="p-admin-visitor-spaces__error">
					{t(
						'modules/admin/visitor-spaces/pages/visitor-spaces-overview/visitor-spaces-overview___geen-bezoekersruimtes-gevonden'
					)}
				</p>
			);
		}
		return renderVisitorSpaces();
	};

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						t(
							'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___alle-bezoekersruimtes'
						)
					)}
				</title>
				<meta
					name="description"
					content={t(
						'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___alle-bezoekersruimtes-meta-omschrijving'
					)}
				/>
			</Head>

			<AdminLayout
				pageTitle={t(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___alle-bezoekersruimtes'
				)}
			>
				{showCreateButton && (
					<AdminLayout.Actions>
						<Button
							iconStart={<Icon name="plus" />}
							label={t(
								'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/index___nieuwe-bezoekersruimte'
							)}
							variants="black"
							onClick={() =>
								router.push(
									`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.visitorSpaceManagement}/${ROUTE_PARTS.visitorSpaces}/${ROUTE_PARTS.create}`
								)
							}
						/>
					</AdminLayout.Actions>
				)}
				<AdminLayout.Content>
					<div className="l-container">{renderPageContent()}</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(
	withAnyRequiredPermissions(VisitorSpacesOverview, Permission.READ_ALL_SPACES)
);
