import { Badge, Button } from '@meemoo/react-components';
import React, { ReactNode } from 'react';

import { Icon, IconNamesLight } from '@shared/components';
import { formatDateTime } from '@shared/components/VisitorSpaceCard/VisitorSpaceCard.utils';
import { tText } from '@shared/helpers/translate';

export const mockNames = [
	'Jan Verminnen',
	'Mike Verfaille',
	'Julie Van Beethoven',
	'Maxim Vanheertum',
	'Marie Heers',
	'Rick Torfs',
	'Harry Smits',
	'Marie Somers',
];

export const mockData = [1, 2, 3, 4, 5, 6, 7, 8].map((data) => {
	const name = mockNames[data - 1];
	const email = `${name.replaceAll(' ', '').toLowerCase()}@gmail.be`;
	const room = 'Bezoekersruimte 1';

	return {
		id: data,
		room,
		name,
		email,
		created_at: new Date().setFullYear(new Date().getFullYear() - data + 1),
		approved: data % 3,
		child: {
			id: 1000 + data,
		},
	};
});

export const mockColumns = [
	{
		Header: 'Location',
		accessor: 'room',
	},
	{
		Header: 'Name',
		accessor: 'name',
	},
	{
		Header: 'Email',
		accessor: 'email',
	},
	{
		Header: 'Timestamp',
		accessor: 'created_at',
		Cell: ({ value }: { value: number }): ReactNode => formatDateTime(new Date(value)),
	},
	{
		Header: 'Status',
		accessor: 'approved',
		Cell: ({ value }: { value: boolean }): ReactNode => (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<Badge
					className="u-mr-8"
					text={<Icon name={value ? IconNamesLight.Check : IconNamesLight.Forbidden} />}
					type={value ? 'success' : 'error'}
				/>
				{value ? 'Ja' : 'Nee'}
			</div>
		),
	},
	{
		id: 'Actions',
		Cell: (
			<Button
				icon={<Icon name={IconNamesLight.DotsVertical} aria-hidden />}
				aria-label={tText('modules/shared/components/table/mocks/table___meer-acties')}
				variants={['xxs', 'text']}
			/>
		),
	},
];
