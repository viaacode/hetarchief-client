import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import SearchBar from './SearchBar';

export default {
	title: 'Components/SearchBar',
	component: SearchBar,
} as ComponentMeta<typeof SearchBar>;

const Template: ComponentStory<typeof SearchBar> = (args) => <SearchBar {...args} />;

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
	large: true,
};
