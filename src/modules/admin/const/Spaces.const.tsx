import { Button } from '@meemoo/react-components';
import Link from 'next/link';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { AdminVisitorSpaceInfoRow } from '@admin/types';
import { DropdownMenu, Icon } from '@shared/components';
import { ROUTES, SEARCH_QUERY_KEY } from '@shared/const';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import { OrderDirection } from '@shared/types';
import { asDate, formatMediumDate } from '@shared/utils';
import { VisitorSpaceInfo, VisitorSpaceOrderProps, VisitorSpaceStatus } from '@visitor-space/types';

export const VisitorSpacesOverviewTablePageSize = 20;

export const ADMIN_VISITOR_SPACES_OVERVIEW_QUERY_PARAM_CONFIG = {
	[SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	status: withDefault(StringParam, 'ALL'),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, VisitorSpaceOrderProps.ContentPartnerName),
	orderDirection: withDefault(SortDirectionParam, OrderDirection.asc),
};

export const VisitorSpacesOverviewTableColumns = (
	updateVisitorSpaceState: (roomId: string, state: VisitorSpaceStatus) => void,
	showEditButton = false,
	showStatusDropdown = false
): Column<VisitorSpaceInfo>[] => [
	{
		Header: tText('modules/admin/const/spaces___bezoekersruimte'),
		id: VisitorSpaceOrderProps.ContentPartnerName,
		accessor: 'name',
	},
	{
		Header: tText('modules/admin/const/spaces___geactiveerd-op'),
		id: VisitorSpaceOrderProps.CreatedAt,
		accessor: 'createdAt',
		Cell: ({ row }: AdminVisitorSpaceInfoRow) => {
			const formatted = formatMediumDate(asDate(row.original.createdAt));
			return (
				<span className="u-color-neutral" title={formatted}>
					{formatted}
				</span>
			);
		},
	},
	{
		Header: tText('modules/admin/const/spaces___emailadres'),
		id: 'email',
		accessor: 'contactInfo.email',
		Cell: ({ row }: AdminVisitorSpaceInfoRow) => {
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
		Header: tText('modules/admin/const/spaces___telefoonnummer'),
		id: 'telephone',
		accessor: 'contactInfo.telephone',
		Cell: ({ row }: AdminVisitorSpaceInfoRow) => {
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
		Header: tText('modules/admin/const/spaces___publicatiestatus'),
		id: VisitorSpaceOrderProps.Status,
		accessor: 'status',
		Cell: ({ row }: AdminVisitorSpaceInfoRow) => {
			// TODO: update when backend is up to date
			let status = '';
			switch (row.original.status) {
				case VisitorSpaceStatus.Active:
					status = 'actief';
					break;
				case VisitorSpaceStatus.Inactive:
					status = 'inactief';
					break;
				case VisitorSpaceStatus.Requested:
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
		id: 'admin-visitor-spaces-overview-table-actions',
		Cell: ({ row }: AdminVisitorSpaceInfoRow) => {
			// TODO: update when backend is up to date
			const status = row.original.status;

			return (
				<>
					{showEditButton && (
						<Link
							href={`${ROUTES.adminEditSpace.replace(':slug', row.original.slug)}`}
							passHref={true}
						>
							<a
								className="u-color-neutral u-font-size-24"
								aria-label={tText('modules/admin/const/spaces___aanpassen')}
							>
								<Icon name="edit" />
							</a>
						</Link>
					)}
					{showStatusDropdown && (
						<DropdownMenu
							triggerButtonProps={{
								onClick: () => null,
								className: 'u-color-neutral u-width-24 u-height-24 u-ml-20',
							}}
						>
							{[VisitorSpaceStatus.Inactive, VisitorSpaceStatus.Requested].includes(
								status
							) && (
								<Button
									className="u-text-left"
									variants="text"
									name="set-status-activated-space"
									label={tText('modules/admin/const/spaces___activeren')}
									onClick={() =>
										updateVisitorSpaceState(
											row.original.id,
											VisitorSpaceStatus.Active
										)
									}
								/>
							)}
							{[VisitorSpaceStatus.Active, VisitorSpaceStatus.Requested].includes(
								status
							) && (
								<Button
									className="u-text-left"
									variants="text"
									name="set-status-deactivated-space"
									label={tText('modules/admin/const/spaces___deactiveren')}
									onClick={() =>
										updateVisitorSpaceState(
											row.original.id,
											VisitorSpaceStatus.Inactive
										)
									}
								/>
							)}
							{[VisitorSpaceStatus.Inactive, VisitorSpaceStatus.Active].includes(
								status
							) && (
								<Button
									className="u-text-left"
									variants="text"
									name="set-status-pending-space"
									label={tText(
										'modules/admin/const/spaces___terug-naar-in-aanvraag'
									)}
									onClick={() =>
										updateVisitorSpaceState(
											row.original.id,
											VisitorSpaceStatus.Requested
										)
									}
								/>
							)}
						</DropdownMenu>
					)}
				</>
			);
		},
	},
];
