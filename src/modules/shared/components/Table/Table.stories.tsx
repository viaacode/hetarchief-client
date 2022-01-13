import { Table } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { PaginationBar } from '..';
import { Icon } from '../Icon';

import { mockColumns, mockData } from './__mocks__/table';

export default {
	title: 'Components/Table',
	component: Table,
	parameters: {
		backgrounds: {
			default: 'platinum',
			values: [
				{ name: 'white', value: '#FFFFFF' },
				{ name: 'platinum', value: '#F8F8F8' },
			],
		},
	},
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

export const Default = Template.bind({});
Default.args = {
	options: {
		columns: mockColumns,
		data: mockData,
	},
	sortingIcons: {
		default: <Icon className="c-table__icon" name="sort-table" />,
		asc: <Icon className="c-table__icon" name="arrow-up" />,
		desc: <Icon className="c-table__icon" name="arrow-down" />,
	},
	pagination: ({ gotoPage }) => {
		return (
			<PaginationBar
				count={6}
				start={0}
				total={123}
				onPageChange={(page) => {
					gotoPage(page);
				}}
			/>
		);
	},
};
