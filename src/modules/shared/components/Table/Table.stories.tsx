import { Table } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { PaginationBar } from '..';
import { Icon } from '../Icon';

import { mockColumns, mockData } from './__mocks__/table';

export default {
	title: 'Components/Table',
	component: Table,
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

export const Default = Template.bind({});
Default.args = {
	options: {
		columns: mockColumns,
		data: mockData,
	},
	sortingIcons: {
		default: <Icon name="sort-table" />,
		asc: <Icon name="arrow-up" />,
		desc: <Icon name="arrow-down" />,
	},
	pagination: ({ pageCount, gotoPage }) => {
		return (
			<PaginationBar
				count={10}
				start={0}
				total={pageCount}
				onPageChange={(page) => {
					gotoPage(page);
				}}
			/>
		);
	},
};
