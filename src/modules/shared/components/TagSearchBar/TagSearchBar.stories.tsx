import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { action } from 'storybook/actions';

import TagSearchBar from './TagSearchBar';

export default {
	title: 'Components/TagSearchBar',
	component: TagSearchBar,
} as Meta<typeof TagSearchBar>;

const Template: StoryFn<typeof TagSearchBar> = (args) => <TagSearchBar {...args} />;

export const Default = Template.bind({});
Default.args = {
	clearLabel: 'Wis volledige zoekopdracht',
	placeholder: 'Zoek:',
	valuePlaceholder: 'Zoek:',
	onInputChange: action('Input changed'),
	onClear: action('Value cleared'),
	onSearch: action('Search triggered'),
};

export const AllowCreate = Template.bind({});
AllowCreate.args = {
	allowCreate: true,
};

export const Large = Template.bind({});
Large.args = {
	size: 'lg',
};

export const Medium = Template.bind({});
Medium.args = {
	size: 'md',
};
