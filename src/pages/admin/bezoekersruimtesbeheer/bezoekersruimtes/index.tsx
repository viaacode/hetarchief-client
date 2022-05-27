import { Button, Column, Table, TableOptions } from '@meemoo/react-components';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useMemo } from 'react';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import {
	ADMIN_READING_ROOMS_OVERVIEW_QUERY_PARAM_CONFIG,
	ReadingRoomsOverviewTableColumns,
	ReadingRoomsOverviewTablePageSize,
} from '@admin/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { useGetReadingRooms } from '@reading-room/hooks/get-reading-rooms';
import { VistorSpaceService } from '@reading-room/services';
import { ReadingRoomOrderProps, ReadingRoomStatus } from '@reading-room/types';
import { Icon, Loading, PaginationBar, SearchBar, sortingIcons } from '@shared/components';
import { ROUTE_PARTS, SEARCH_QUERY_KEY } from '@shared/const';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { toastService } from '@shared/services/toast-service';
import { OrderDirection } from '@shared/types';
import { createPageTitle } from '@shared/utils';

const ReadingRoomsOverview: FC = () => {
	const { t } = useTranslation();
	const router = useRouter();

	const showCreateButton = useHasAllPermission(Permission.CREATE_SPACES);
	const showEditButton = useHasAllPermission(Permission.UPDATE_ALL_SPACES);
	const showStatusDropdown = useHasAllPermission(Permission.EDIT_ALL_SPACES_STATUS);

	const [filters, setFilters] = useQueryParams(ADMIN_READING_ROOMS_OVERVIEW_QUERY_PARAM_CONFIG);

	const {
		data: readingRooms,
		isLoading,
		isError,
		refetch,
	} = useGetReadingRooms(
		filters.search,
		filters.page,
		ReadingRoomsOverviewTablePageSize,
		filters.orderProp as ReadingRoomOrderProps,
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
			title: t('pages/admin/leeszalenbeheer/leeszalen/index___er-ging-iets-mis'),
			description: t(
				'pages/admin/leeszalenbeheer/leeszalen/index___er-is-een-fout-opgetreden-tijdens-het-aanpassen-van-de-status'
			),
		});
	};

	const updateRoomStatus = (roomId: string, status: ReadingRoomStatus) => {
		VistorSpaceService.update(roomId, {
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
					title: t('pages/admin/leeszalenbeheer/leeszalen/index___succes'),
					description: t(
						'pages/admin/leeszalenbeheer/leeszalen/index___de-status-werd-succesvol-aangepast'
					),
				});
			});
	};

	// Render

	const renderVisitorSpaces = () => (
		<>
			<div className="p-admin-reading-rooms__header">
				<SearchBar
					default={filters[SEARCH_QUERY_KEY]}
					className="p-admin-reading-rooms__search"
					placeholder={t('pages/admin/leeszalenbeheer/leeszalen/index___zoek')}
					onSearch={(value) => setFilters({ [SEARCH_QUERY_KEY]: value })}
				/>
			</div>

			<div className="l-container--edgeless-to-lg">
				<Table
					className="u-mt-24"
					options={
						// TODO: fix type hinting
						/* eslint-disable @typescript-eslint/ban-types */
						{
							columns: ReadingRoomsOverviewTableColumns(
								updateRoomStatus,
								showEditButton,
								showStatusDropdown
							) as Column<object>[],
							data: readingRooms?.items || [],
							initialState: {
								pageSize: ReadingRoomsOverviewTablePageSize,
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
								count={ReadingRoomsOverviewTablePageSize}
								start={
									Math.max(0, filters.page - 1) *
									ReadingRoomsOverviewTablePageSize
								}
								total={readingRooms?.total || 0}
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
			</div>
		</>
	);

	const renderPageContent = () => {
		if (isLoading) {
			return <Loading />;
		}
		if (isError) {
			return (
				<p className="p-admin-reading-rooms__error">
					{t(
						'pages/admin/leeszalenbeheer/leeszalen/index___er-ging-iets-mis-bij-het-ophalen-van-de-leeszalen'
					)}
				</p>
			);
		}
		if (!readingRooms) {
			return (
				<p className="p-admin-reading-rooms__error">
					{t(
						'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___geen-leeszalen-gevonden'
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
						t('pages/admin/leeszalenbeheer/leeszalen/index___alle-leeszalen')
					)}
				</title>
				<meta
					name="description"
					content={t(
						'pages/admin/leeszalenbeheer/leeszalen/index___alle-leeszalen-meta-omschrijving'
					)}
				/>
			</Head>

			<AdminLayout
				pageTitle={t('pages/admin/leeszalenbeheer/leeszalen/index___alle-leeszalen')}
			>
				{showCreateButton && (
					<AdminLayout.Actions>
						<Button
							iconStart={<Icon name="plus" />}
							label={t(
								'pages/admin/bezoekersruimtes-beheer/bezoekersruimtes/index___nieuwe-leeszaal'
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
	withAnyRequiredPermissions(ReadingRoomsOverview, Permission.READ_ALL_SPACES)
);
