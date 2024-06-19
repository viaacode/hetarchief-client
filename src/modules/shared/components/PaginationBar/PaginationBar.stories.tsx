import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import React from 'react';

import PaginationBar from './PaginationBar';

export default {
	title: 'Components/PaginationBar',
	component: PaginationBar,
} as ComponentMeta<typeof PaginationBar>;

const Template: ComponentStory<typeof PaginationBar> = (args) => <PaginationBar {...args} />;

export const Default = Template.bind({});
Default.args = {
	start: 500,
	count: 50,
	total: 1024,
};

export const BackToTop = Template.bind({});
BackToTop.args = {
	...Default.args,
	showBackToTop: true,
};
