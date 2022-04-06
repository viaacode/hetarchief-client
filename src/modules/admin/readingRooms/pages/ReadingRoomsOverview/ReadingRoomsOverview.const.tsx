import { Button } from '@meemoo/react-components';
import { TFunction } from 'next-i18next';
import { generatePath, Link } from 'react-router-dom';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { ReadingRoomInfo } from '@reading-room/types';
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
	i18n: { t: TFunction } = { t: (x: string) => x }
): Column<ReadingRoomInfo>[] => [
	{
		Header: i18n.t('Leeszaal') || '',
		accessor: 'name',
	},
	{
		Header: i18n.t('Geactiveerd op') || '',
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
		Header: i18n.t('Emailadres') || '',
		id: 'admin-reading-rooms-overview-email',
		accessor: (row) => row.contactInfo.email,
	},
	{
		Header: i18n.t('Telefoonnummer') || '',
		id: 'admin-reading-rooms-overview-telephone',
		accessor: (row) => row.contactInfo.telephone,
	},
	{
		Header: i18n.t('Publicatiestatus') || '',
		accessor: 'isPublished',
		Cell: ({ row }: AdminReadingRoomInfoRow) => {
			// TODO: update when backend is up to date
			switch (row.original.isPublished) {
				case true:
					return 'actief';
				case false:
					return 'inactief';
				default:
					return 'in aanvraag';
			}
		},
	},
	{
		Header: '',
		id: 'admin-reading-rooms-overview-table-actions',
		Cell: ({ row }: AdminReadingRoomInfoRow) => {
			// TODO: update when backend is up to date
			const published = row.original.isPublished;

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
						{!published && (
							<Button
								className="u-text-left"
								variants="text"
								label={i18n.t('Activeren')}
							/>
						)}
						{(published || published === null) && (
							<Button
								className="u-text-left"
								variants="text"
								label={i18n.t('Deactiveren')}
							/>
						)}
						{published !== null && (
							<Button
								className="u-text-left"
								variants="text"
								label={i18n.t('Terug naar "in aanvraag"')}
							/>
						)}
					</DropdownMenu>
				</>
			);
		},
	},
];
