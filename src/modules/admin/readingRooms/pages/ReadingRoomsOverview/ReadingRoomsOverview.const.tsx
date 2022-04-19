import { Button } from '@meemoo/react-components';
import { TFunction } from 'next-i18next';
import { generatePath, Link } from 'react-router-dom';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { ReadingRoomInfo, ReadingRoomOrderProps, ReadingRoomStatus } from '@reading-room/types';
import { DropdownMenu, Icon } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { SortDirectionParam } from '@shared/helpers';
import { asDate, formatLongDate } from '@shared/utils';

import { READING_ROOMS_PATHS } from '../../const';
import { AdminReadingRoomInfoRow } from '../../types';

export const ReadingRoomsOverviewTablePageSize = 20;

export const ADMIN_READING_ROOMS_OVERVIEW_QUERY_PARAM_CONFIG = {
	[SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, undefined),
	orderDirection: withDefault(SortDirectionParam, undefined),
};

export const ReadingRoomsOverviewTableColumns = (
	t: TFunction,
	updateRoomState: (state: ReadingRoomStatus) => void
): Column<ReadingRoomInfo>[] => [
	{
		Header:
			t(
				'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___leeszaal'
			) || '',
		id: ReadingRoomOrderProps.ContentPartnerName,
		accessor: 'name',
	},
	{
		Header:
			t(
				'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___geactiveerd-op'
			) || '',
		id: ReadingRoomOrderProps.CreatedAt,
		accessor: 'createdAt',
		Cell: ({ row }: AdminReadingRoomInfoRow) => {
			const formatted = formatLongDate(asDate(row.original.createdAt));
			return (
				<span className="u-color-neutral" title={formatted}>
					{formatted}
				</span>
			);
		},
	},
	{
		Header:
			t(
				'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___emailadres'
			) || '',
		id: 'email',
		accessor: 'contactInfo.email',
		Cell: ({ row }: AdminReadingRoomInfoRow) => {
			return (
				<span className="u-color-neutral" title={row.original.contactInfo.email || ''}>
					{row.original.contactInfo.email}
				</span>
			);
		},
		disableSortBy: true,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any,
	{
		Header:
			t(
				'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___telefoonnummer'
			) || '',
		id: 'telephone',
		accessor: 'contactInfo.telephone',
		Cell: ({ row }: AdminReadingRoomInfoRow) => {
			return (
				<span className="u-color-neutral" title={row.original.contactInfo.telephone || ''}>
					{row.original.contactInfo.telephone}
				</span>
			);
		},
		disableSortBy: true,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any,
	{
		Header:
			t(
				'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___publicatiestatus'
			) || '',
		id: ReadingRoomOrderProps.Status,
		accessor: 'status',
		Cell: ({ row }: AdminReadingRoomInfoRow) => {
			// TODO: update when backend is up to date
			let status = '';
			switch (row.original.status) {
				case ReadingRoomStatus.Active:
					status = 'actief';
					break;
				case ReadingRoomStatus.Inactive:
					status = 'inactief';
					break;
				case ReadingRoomStatus.Requested:
					status = 'in aanvraag';
					break;
			}

			return (
				<span className="u-color-neutral" title={status}>
					{status}
				</span>
			);
		},
	},
	{
		Header: '',
		id: 'admin-reading-rooms-overview-table-actions',
		Cell: ({ row }: AdminReadingRoomInfoRow) => {
			// TODO: update when backend is up to date
			const status = row.original.status;

			return (
				<>
					<Link
						to={generatePath(READING_ROOMS_PATHS.edit, {
							pageName: row.original.maintainerId,
						})}
					>
						<Button
							className="u-color-neutral"
							variants="text"
							icon={<Icon name="edit" />}
						/>
					</Link>
					<DropdownMenu
						triggerButtonProps={{ onClick: () => null, className: 'u-color-neutral' }}
					>
						{[ReadingRoomStatus.Inactive, ReadingRoomStatus.Requested].includes(
							status
						) && (
							<Button
								className="u-text-left"
								variants="text"
								label={t(
									'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___activeren'
								)}
								onClick={() => updateRoomState(ReadingRoomStatus.Active)}
							/>
						)}
						{[ReadingRoomStatus.Active, ReadingRoomStatus.Requested].includes(
							status
						) && (
							<Button
								className="u-text-left"
								variants="text"
								label={t(
									'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___deactiveren'
								)}
								onClick={() => updateRoomState(ReadingRoomStatus.Inactive)}
							/>
						)}
						{[ReadingRoomStatus.Inactive, ReadingRoomStatus.Active].includes(
							status
						) && (
							<Button
								className="u-text-left"
								variants="text"
								label={t(
									'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___terug-naar-in-aanvraag'
								)}
								onClick={() => updateRoomState(ReadingRoomStatus.Requested)}
							/>
						)}
					</DropdownMenu>
				</>
			);
		},
	},
];
