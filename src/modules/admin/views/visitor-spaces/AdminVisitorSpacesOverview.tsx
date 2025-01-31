import { Button, OrderDirection, PaginationBar, Table } from '@meemoo/react-components';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { type FC, type ReactNode, useMemo, useState } from 'react';
import type { TableState } from 'react-table';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import {
	ADMIN_VISITOR_SPACES_OVERVIEW_QUERY_PARAM_CONFIG,
	VisitorSpacesOverviewTableColumns,
	VisitorSpacesOverviewTablePageSize,
} from '@admin/const/Spaces.const';
import { AdminLayout } from '@admin/layouts';
import styles from '@admin/layouts/AdminLayout/AdminLayout.module.scss';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SearchBar } from '@shared/components/SearchBar';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { sortingIcons } from '@shared/components/Table';
import { ScrollableTabs } from '@shared/components/Tabs';
import { globalLabelKeys, ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { VisitorSpaceStatusOptions } from '@visitor-space/const';
import { useGetVisitorSpaces } from '@visitor-space/hooks/get-visitor-spaces';
import { VisitorSpaceService } from '@visitor-space/services';
import {
	type VisitorSpaceInfo,
	type VisitorSpaceOrderProps,
	VisitorSpaceStatus,
} from '@visitor-space/types';

export const AdminVisitorSpacesOverview: FC<DefaultSeoInfo> = ({ url }) => {
	const router = useRouter();
	const locale = useLocale();

	const showCreateButton = useHasAllPermission(Permission.CREATE_SPACES);
	const showEditButton = useHasAllPermission(Permission.UPDATE_ALL_SPACES);
	const showStatusDropdown = useHasAllPermission(Permission.EDIT_ALL_SPACES_STATUS);

	const [filters, setFilters] = useQueryParams(ADMIN_VISITOR_SPACES_OVERVIEW_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || '');

	const {
		data: visitorSpaces,
		isLoading,
		isError,
		refetch,
		isFetching,
	} = useGetVisitorSpaces(
		filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY],
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

	const onSortChange = (
		orderProp: string | undefined,
		orderDirection: OrderDirection | undefined
	) => {
		if (!orderProp) {
			orderProp = 'created_at';
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

	// Callbacks
	const onFailedRequest = () => {
		refetch();

		toastService.notify({
			maxLines: 3,
			title: tHtml(
				'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-ging-iets-mis'
			),
			description: tHtml(
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
					title: tHtml(
						'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___succes'
					),
					description: tHtml(
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

	const renderEmptyMessage = (): string | ReactNode => {
		switch (filters.status) {
			case VisitorSpaceStatus.Requested:
				return tHtml(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-zijn-geen-bezoekersruimtes-in-aanvraag'
				);

			case VisitorSpaceStatus.Active:
				return tHtml(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-zijn-geen-gepubliceerde-bezoekersruimtes'
				);

			case VisitorSpaceStatus.Inactive:
				return tHtml(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-zijn-geen-gedepubliceerde-bezoekersruimtes'
				);

			default:
				return tHtml(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-zijn-geen-bezoekersruimtes'
				);
		}
	};

	const renderVisitorSpacesTable = () => {
		if (isFetching) {
			return (
				<div className="l-container l-container--edgeless-to-lg u-text-center u-color-neutral u-py-48">
					<Loading owner="admin visitor spaces page: table loading" />
				</div>
			);
		}
		if (!visitorSpaces?.items?.length) {
			return (
				<div className="l-container l-container--edgeless-to-lg u-text-center u-color-neutral u-py-48">
					{renderEmptyMessage()}
				</div>
			);
		}
		return (
			<Table<VisitorSpaceInfo>
				className="u-mt-24"
				options={{
					columns: VisitorSpacesOverviewTableColumns(
						updateRoomStatus,
						showEditButton,
						showStatusDropdown,
						locale
					),
					data: visitorSpaces?.items || [],
					initialState: {
						pageSize: VisitorSpacesOverviewTablePageSize,
						sortBy: sortFilters,
					} as TableState<VisitorSpaceInfo>,
				}}
				onSortChange={onSortChange}
				sortingIcons={sortingIcons}
				pagination={({ gotoPage }) => {
					return (
						<PaginationBar
							{...getDefaultPaginationBarProps()}
							itemsPerPage={VisitorSpacesOverviewTablePageSize}
							startItem={
								Math.max(0, filters.page - 1) * VisitorSpacesOverviewTablePageSize
							}
							totalItems={visitorSpaces?.total || 0}
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

	const renderVisitorSpaces = () => {
		const pageTitle = tText(
			'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___alle-bezoekersruimtes'
		);
		return (
			<>
				<header className={clsx(styles['c-admin__header'])}>
					<h2 className={styles['c-admin__page-title']}>
						<label htmlFor={globalLabelKeys.adminLayout.title} title={pageTitle}>
							{pageTitle}
						</label>
					</h2>
					<div className={styles['c-admin__actions']}>
						{showCreateButton && (
							<Button
								iconStart={<Icon name={IconNamesLight.Plus} />}
								label={tHtml(
									'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/index___nieuwe-bezoekersruimte'
								)}
								variants="black"
								onClick={() =>
									router.push(
										`/${ROUTE_PARTS_BY_LOCALE[locale].admin}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaceManagement}/${ROUTE_PARTS_BY_LOCALE[locale].visitorSpaces}/${ROUTE_PARTS_BY_LOCALE[locale].create}`
									)
								}
							/>
						)}
					</div>
				</header>
				<div className="p-cp-visitor-spaces__header">
					<SearchBar
						id={globalLabelKeys.adminLayout.title}
						value={search}
						className="p-cp-visitor-spaces__search"
						placeholder={tText(
							'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___zoek'
						)}
						onChange={setSearch}
						onSearch={(newValue) =>
							setFilters({
								[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: newValue || undefined,
								page: 1,
							})
						}
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
	};

	const renderPageContent = () => {
		if (isLoading) {
			return <Loading owner="admin visitor spaces page: render page content" fullscreen />;
		}
		if (isError) {
			return (
				<p className="p-admin-visitor-spaces__error">
					{tHtml(
						'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___er-ging-iets-mis-bij-het-ophalen-van-de-bezoekersruimtes'
					)}
				</p>
			);
		}
		if (!visitorSpaces) {
			return (
				<p className="p-admin-visitor-spaces__error">
					{tHtml(
						'modules/admin/visitor-spaces/pages/visitor-spaces-overview/visitor-spaces-overview___geen-bezoekersruimtes-gevonden'
					)}
				</p>
			);
		}
		return renderVisitorSpaces();
	};

	const renderPageLayoutAndContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container">{renderPageContent()}</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			<SeoTags
				title={tText(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___alle-bezoekersruimtes'
				)}
				description={tText(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/index___alle-bezoekersruimtes-meta-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>
			<PermissionsCheck allPermissions={[Permission.READ_ALL_SPACES]}>
				{renderPageLayoutAndContent()}
			</PermissionsCheck>
		</>
	);
};
