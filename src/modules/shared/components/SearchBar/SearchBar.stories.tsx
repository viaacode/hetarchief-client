import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { tagsInputOptionsMock } from '../TagsInput/__mocks__/tags-input';

import SearchBar from './SearchBar';

export default {
	title: 'Components/SearchBar',
	component: SearchBar,
} as ComponentMeta<typeof SearchBar>;

const Template: ComponentStory<typeof SearchBar> = (args) => <SearchBar {...args} />;

export const Default = Template.bind({});
Default.args = {
	allowCreate: true,
	isClearable: true,
	isMulti: true,
	menuIsOpen: true,
	// options: ,
	value: tagsInputOptionsMock,
};

export const AllowCreate = Template.bind({});
AllowCreate.args = {
	allowCreate: true,
};
