import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import ObjectPlaceholder from './ObjectPlaceholder';
import { objectPlaceholderMock } from './__mocks__/object-placeholder';

export default {
	title: 'Components/ObjectPlaceholder',
	component: ObjectPlaceholder,
} as ComponentMeta<typeof ObjectPlaceholder>;

const Template: ComponentStory<typeof ObjectPlaceholder> = (args) => (
	<div style={{ height: '90vh', width: '50vw' }}>
		<ObjectPlaceholder {...args} />
	</div>
);

export const Default = Template.bind({});
Default.args = {
	...objectPlaceholderMock,
};
