import { TagsInput, TagsInputProps } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { cloneElement, FC, ReactElement, useState } from 'react';

import { TAGS_INPUT_DEFAULT_PROPS } from './TagsInput.const';
import { tagsInputOptionsMock } from './__mocks__/tags-input';

const TagsInputStoryComponent = ({ children }: { children: ReactElement }) => {
	const [values, setValues] = useState(tagsInputOptionsMock);

	const onChange = (values: unknown) => {
		console.log('storybook', values);

		// setValues();
	};

	return cloneElement<TagsInputProps>(children, {
		value: values,
		onChange,
	});
};

export default {
	title: 'Components/TagsInput',
	component: TagsInput,
} as ComponentMeta<typeof TagsInput>;

const Template: ComponentStory<typeof TagsInput> = (args) => (
	<TagsInputStoryComponent>
		<TagsInput {...TAGS_INPUT_DEFAULT_PROPS} {...args} />
	</TagsInputStoryComponent>
);

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
