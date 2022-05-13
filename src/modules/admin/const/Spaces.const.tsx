import { Button } from '@meemoo/react-components';
import Link from 'next/link';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { AdminReadingRoomInfoRow } from '@admin/types';
import { ReadingRoomOrderProps, ReadingRoomStatus, VisitorSpaceInfo } from '@reading-room/types';
import { DropdownMenu, Icon } from '@shared/components';
import { ROUTES, SEARCH_QUERY_KEY } from '@shared/const';
import { SortDirectionParam } from '@shared/helpers';
import { i18n } from '@shared/helpers/i18n';
import { OrderDirection } from '@shared/types';
import { asDate, formatLongDate } from '@shared/utils';

export const ReadingRoomsOverviewTablePageSize = 20;

export const ADMIN_READING_ROOMS_OVERVIEW_QUERY_PARAM_CONFIG = {
	[SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, ReadingRoomOrderProps.CreatedAt),
	orderDirection: withDefault(SortDirectionParam, OrderDirection.desc),
};

export const ReadingRoomsOverviewTableColumns = (
	updateVisitorSpaceState: (roomId: string, state: ReadingRoomStatus) => void
): Column<VisitorSpaceInfo>[] => [
	{
		Header: i18n.t('modules/admin/const/spaces___bezoekersruimte'),
		id: ReadingRoomOrderProps.ContentPartnerName,
		accessor: 'name',
	},
	{
		Header: i18n.t('modules/admin/const/spaces___geactiveerd-op'),
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
		Header: i18n.t('modules/admin/const/spaces___emailadres'),
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
		Header: i18n.t('modules/admin/const/spaces___telefoonnummer'),
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
		Header: i18n.t('modules/admin/const/spaces___publicatiestatus'),
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
						href={`${ROUTES.adminEditSpace.replace(':slug', row.original.slug)}`}
						passHref={true}
					>
						<a className="u-color-neutral u-font-size-24">
							<Icon name="edit" />
						</a>
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
								label={i18n.t('modules/admin/const/spaces___activeren')}
								onClick={() =>
									updateVisitorSpaceState(
										row.original.id,
										ReadingRoomStatus.Active
									)
								}
							/>
						)}
						{[ReadingRoomStatus.Active, ReadingRoomStatus.Requested].includes(
							status
						) && (
							<Button
								className="u-text-left"
								variants="text"
								label={i18n.t('modules/admin/const/spaces___deactiveren')}
								onClick={() =>
									updateVisitorSpaceState(
										row.original.id,
										ReadingRoomStatus.Inactive
									)
								}
							/>
						)}
						{[ReadingRoomStatus.Inactive, ReadingRoomStatus.Active].includes(
							status
						) && (
							<Button
								className="u-text-left"
								variants="text"
								label={i18n.t(
									'modules/admin/const/spaces___terug-naar-in-aanvraag'
								)}
								onClick={() =>
									updateVisitorSpaceState(
										row.original.id,
										ReadingRoomStatus.Requested
									)
								}
							/>
						)}
					</DropdownMenu>
				</>
			);
		},
	},
];
