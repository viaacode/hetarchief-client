import { TagsInput, TagsInputProps } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { cloneElement, ReactElement, useState } from 'react';

import { TAGS_INPUT_COMPONENTS } from './TagsInput.const';
import { tagsInputOptionsMock } from './__mocks__/tags-input';

const TagsInputStoryComponent = ({ children }: { children: ReactElement }) => {
	const [values, setValues] = useState<TagsInputProps['value']>(tagsInputOptionsMock);

	const onChange = (values: TagsInputProps['value']) => {
		setValues(values);
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
		<TagsInput components={{ ...TAGS_INPUT_COMPONENTS }} {...args} />
	</TagsInputStoryComponent>
);

export const Default = Template.bind({});
Default.args = {};

export const AllowCreate = Template.bind({});
AllowCreate.args = {
	allowCreate: true,
};
