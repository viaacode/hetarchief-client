import { Badge, Button, Tag } from '@meemoo/react-components';
import React, { ReactNode } from 'react';

import { Icon } from '@shared/components';
import { formatDateTime } from '@shared/components/ReadingRoomCard/ReadingRoomCard.utils';

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
	const room = 'Leeszaal 1';

	return {
		id: data,
		room,
		name,
		email,
		created_at: new Date().setFullYear(new Date().getFullYear() - data),
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
					text={<Icon name={value ? 'check' : 'forbidden'} />}
					type={value ? 'success' : 'error'}
				/>
				{value ? 'Ja' : 'Nee'}
			</div>
		),
	},
	{
		id: 'Actions',
		Cell: <Button icon={<Icon name="dots-vertical" />} variants={['xxs', 'text']} />,
	},
];
