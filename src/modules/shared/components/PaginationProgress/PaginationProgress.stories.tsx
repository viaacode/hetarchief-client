import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import PaginationProgress from './PaginationProgress';

export default {
	title: 'Components/PaginationProgress',
	component: PaginationProgress,
} as ComponentMeta<typeof PaginationProgress>;

const Template: ComponentStory<typeof PaginationProgress> = (args) => (
	<PaginationProgress {...args} />
);

export const Default = Template.bind({});
Default.args = {
	start: 500,
	end: 550,
	total: 1024,
};
