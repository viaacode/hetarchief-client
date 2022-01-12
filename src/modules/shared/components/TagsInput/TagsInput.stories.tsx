import { TagsInput } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { tagsInputOptionsMock } from './__mocks__/tags-input';

export default {
	title: 'Components/TagsInput',
	component: TagsInput,
} as ComponentMeta<typeof TagsInput>;

const Template: ComponentStory<typeof TagsInput> = (args) => <TagsInput {...args} />;

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
