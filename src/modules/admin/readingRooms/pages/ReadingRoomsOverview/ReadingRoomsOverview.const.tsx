import { Button } from '@meemoo/react-components';
import { TFunction } from 'next-i18next';
import { generatePath, Link } from 'react-router-dom';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { ReadingRoomInfo, ReadingRoomStatus } from '@reading-room/types';
import { DropdownMenu, Icon } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { SortDirectionParam } from '@shared/helpers';
import { asDate, formatWithLocale } from '@shared/utils';

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
		accessor: 'name',
	},
	{
		Header:
			t(
				'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___geactiveerd-op'
			) || '',
		accessor: 'createdAt',
		Cell: ({ row }: AdminReadingRoomInfoRow) => {
			const formattedDate = formatWithLocale('PPP', asDate(row.original.createdAt));
			return (
				<span className="u-color-neutral" title={formattedDate}>
					{formattedDate}
				</span>
			);
		},
	},
	{
		Header:
			t(
				'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___emailadres'
			) || '',
		id: 'admin-reading-rooms-overview-email',
		accessor: (row) => row.contactInfo.email,
	},
	{
		Header:
			t(
				'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___telefoonnummer'
			) || '',
		id: 'admin-reading-rooms-overview-telephone',
		accessor: (row) => row.contactInfo.telephone,
	},
	{
		Header:
			t(
				'modules/admin/reading-rooms/pages/reading-rooms-overview/reading-rooms-overview___publicatiestatus'
			) || '',
		accessor: 'status',
		Cell: ({ row }: AdminReadingRoomInfoRow) => {
			// TODO: update when backend is up to date
			switch (row.original.status) {
				case ReadingRoomStatus.Active:
					return 'actief';
				case ReadingRoomStatus.Inactive:
					return 'inactief';
				case ReadingRoomStatus.Requested:
					return 'in aanvraag';
				default:
					return '';
			}
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
						<Button variants="text" icon={<Icon name="edit" />} />
					</Link>
					<DropdownMenu className=" u-color-neutral">
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
