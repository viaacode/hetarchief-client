import { Button } from '@meemoo/react-components';
import { startCase } from 'lodash-es';
import React from 'react';
import { generatePath, Link } from 'react-router-dom';
import { Column } from 'react-table';

import { Navigation } from '@navigation/services/navigation-service';
import { Icon } from '@shared/components';

import { NAVIGATION_PATHS } from '../../const';
import { NavigationOverviewCellProps } from '../../types';

export const NAVIGATION_OVERVIEW_COLS = (headers: Record<string, string>): Column<Navigation>[] => [
	{
		id: 'name',
		Header: headers.name,
		accessor: 'placement',
		Cell: ({ row }: NavigationOverviewCellProps) => {
			const placement = row?.original?.placement ?? '';
			return (
				<Link to={generatePath(NAVIGATION_PATHS.detail, { navigationName: placement })}>
					{startCase(placement)}
				</Link>
			);
		},
	},
	{
		id: 'description',
		Header: headers.description,
		accessor: 'description',
	},
	{
		id: 'actions',
		Header: headers.actions,
		Cell: ({ row }: NavigationOverviewCellProps) => {
			const placement = row.original.placement ?? '';
			return (
				<div>
					<Link to={generatePath(NAVIGATION_PATHS.detail, { navigationName: placement })}>
						<Button icon={<Icon name="show" />} variants={['text', 'small']} />
					</Link>
					<Link to={generatePath(NAVIGATION_PATHS.detail, { navigationName: placement })}>
						<Button icon={<Icon name="plus" />} variants={['text', 'small']} />
					</Link>
				</div>
			);
		},
	},
];
