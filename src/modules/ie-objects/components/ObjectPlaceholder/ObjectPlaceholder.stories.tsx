import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { objectPlaceholderMock } from './__mocks__/object-placeholder';
import ObjectPlaceholder from './ObjectPlaceholder';

export default {
	title: 'Components/ObjectPlaceholder',
	component: ObjectPlaceholder,
} as Meta<typeof ObjectPlaceholder>;

const Template: StoryFn<typeof ObjectPlaceholder> = (args) => (
	<div style={{ height: '90vh', width: '50vw' }}>
		<ObjectPlaceholder {...args} />
	</div>
);

export const Default = Template.bind({});
Default.args = {
	...objectPlaceholderMock,
};
