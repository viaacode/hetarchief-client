import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import TagSearchBar from './TagSearchBar';

export default {
	title: 'Components/TagSearchBar',
	component: TagSearchBar,
} as ComponentMeta<typeof TagSearchBar>;

const Template: ComponentStory<typeof TagSearchBar> = (args) => <TagSearchBar {...args} />;

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
