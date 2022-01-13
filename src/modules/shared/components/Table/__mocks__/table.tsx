import React from 'react';

export const mockData = [1, 2, 3, 4, 5, 6].map((data) => {
	return {
		id: data,
		name: data.toString(),
		created_at: new Date().setFullYear(new Date().getFullYear() - data),
		child: {
			id: 1000 + data,
		},
	};
});

export const mockColumns = [
	{
		Header: 'Id',
		accessor: 'id', // accessor is the "key" in the data
		disableSortBy: true,
	},
	{
		Header: 'Name',
		accessor: 'name',
	},
	{
		Header: 'Created at',
		accessor: 'created_at',
	},
	{
		id: 'Actions',
		Cell: <button>More</button>,
	},
];
