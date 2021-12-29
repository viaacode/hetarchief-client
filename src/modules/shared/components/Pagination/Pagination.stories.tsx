import { Pagination } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon, IconLightNames } from '../Icon';

const renderButton = (icon: IconLightNames, label: string, layout: 'left' | 'right') => (
	<>
		{layout === 'left' && <span>{label}</span>}
		<Icon className="c-pagination__icon" name={icon} />
		{layout === 'right' && <span>{label}</span>}
	</>
);

export default {
	title: 'Components/Pagination',
	component: Pagination,
} as ComponentMeta<typeof Pagination>;

const Template: ComponentStory<typeof Pagination> = (args) => <Pagination {...args} />;

export const Default = Template.bind({});
Default.args = {
	pageCount: 5,
	displayCount: 5,
	currentPage: 0,
	onPageChange: (page: number) => console.log(`page index is ${page}`),
	showFirstLastNumbers: true,
	buttons: {
		previous: renderButton('angle-left', 'Vorige', 'right'),
		next: renderButton('angle-right', 'Volgende', 'left'),
	},
};

export const FirstPage = Template.bind({});
FirstPage.args = {
	pageCount: 9,
	displayCount: 5,
	currentPage: 0,
	onPageChange: (page: number) => console.log(`page index is ${page}`),
	showFirstLastNumbers: true,
	buttons: {
		previous: renderButton('angle-left', 'Vorige', 'right'),
		next: renderButton('angle-right', 'Volgende', 'left'),
	},
};

export const MiddlePage = Template.bind({});
MiddlePage.args = {
	pageCount: 9,
	displayCount: 5,
	currentPage: 5,
	onPageChange: (page: number) => console.log(`page index is ${page}`),
	showFirstLastNumbers: true,
	buttons: {
		previous: renderButton('angle-left', 'Vorige', 'right'),
		next: renderButton('angle-right', 'Volgende', 'left'),
	},
};

export const LastPage = Template.bind({});
LastPage.args = {
	pageCount: 9,
	displayCount: 5,
	currentPage: 8,
	onPageChange: (page: number) => console.log(`page index is ${page}`),
	showFirstLastNumbers: true,
	buttons: {
		previous: renderButton('angle-left', 'Vorige', 'right'),
		next: renderButton('angle-right', 'Volgende', 'left'),
	},
};

export const WithoutShortcuts = Template.bind({});
WithoutShortcuts.args = {
	pageCount: 9,
	displayCount: 5,
	currentPage: 5,
	onPageChange: (page: number) => console.log(`page index is ${page}`),
	buttons: {
		previous: renderButton('angle-left', 'Vorige', 'right'),
		next: renderButton('angle-right', 'Volgende', 'left'),
	},
};
