import { Column, Table, TableOptions } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import React, { FC, useCallback, useMemo } from 'react';
import { useQueryParams } from 'use-query-params';

import { useGetReadingRooms } from '@reading-room/hooks/get-reading-rooms';
import { ReadingRoomService } from '@reading-room/services';
import { ReadingRoomOrderProps, ReadingRoomStatus } from '@reading-room/types';
import { Loading, PaginationBar, SearchBar, sortingIcons } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { toastService } from '@shared/services/toast-service';
import { OrderDirection } from '@shared/types';

import {
	ADMIN_READING_ROOMS_OVERVIEW_QUERY_PARAM_CONFIG,
	ReadingRoomsOverviewTableColumns,
	ReadingRoomsOverviewTablePageSize,
} from './ReadingRoomsOverview.const';

const ReadingRoomsOverview: FC = () => {
	const { t } = useTranslation();
	const [filters, setFilters] = useQueryParams(ADMIN_READING_ROOMS_OVERVIEW_QUERY_PARAM_CONFIG);

	const {
		data: readingRooms,
		isLoading,
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
			title: t('er ging iets mis'),
			description: t('er is een fout opgetreden tijdens het aanpassen van de status'),
		});
	};

	const updateRoomStatus = (roomId: string, status: ReadingRoomStatus) => {
		ReadingRoomService.update(roomId, {
			status: status,
		})
			.catch(onFailedRequest)
			.then((response) => {
				if (response === undefined) {
					return;
				}

				refetch();

				toastService.notify({
					maxLines: 3,
					title: t('succes'),
					description: t('de status werd succesvol aangepast'),
				});
			});
	};

	// Render

	const renderEmptyMessage = (): string => {
		return t(
			'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___geen-leeszalen-gevonden'
		);
	};

	return (
		<div>
			<h2 className="u-mb-40">
				{t(
					'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___alle-leeszalen'
				)}
			</h2>
			{!isLoading && readingRooms ? (
				<>
					<div className="p-admin-reading-rooms__header">
						<SearchBar
							backspaceRemovesValue={false}
							className="p-admin-reading-rooms__search"
							instanceId="admin-reading-rooms-search-bar"
							light={true}
							placeholder={t(
								'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___zoek'
							)}
							searchValue={filters.search}
							size="md"
							onClear={() => {
								setFilters({
									[SEARCH_QUERY_KEY]: '',
									page: 1,
								});
							}}
							onSearch={(searchValue: string) => {
								// Force rerender
								if (filters.search === searchValue) {
									setFilters({
										[SEARCH_QUERY_KEY]: '',
										page: 1,
									});
								}

								setFilters({
									[SEARCH_QUERY_KEY]: searchValue,
									page: 1,
								});
							}}
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
										t,
										updateRoomStatus
									) as Column<object>[],
									data: readingRooms.items || [],
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
										total={readingRooms.total || 0}
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
				</>
			) : (
				<div className="l-container l-container--edgeless-to-lg u-text-center u-color-neutral u-py-48">
					{isLoading ? <Loading /> : renderEmptyMessage()}
				</div>
			)}
		</div>
	);
};

export default ReadingRoomsOverview;
