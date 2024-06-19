import { Table } from '@meemoo/react-components';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

import { PaginationBar } from '../PaginationBar';

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
		default: <Icon className="c-table__icon" name={IconNamesLight.SortTable} />,
		asc: <Icon className="c-table__icon" name={IconNamesLight.ArrowUp} />,
		desc: <Icon className="c-table__icon" name={IconNamesLight.ArrowDown} />,
	},
	pagination: ({ gotoPage }) => {
		return (
			<PaginationBar
				count={8}
				start={0}
				total={123}
				onPageChange={(page) => {
					gotoPage(page);
				}}
			/>
		);
	},
};
