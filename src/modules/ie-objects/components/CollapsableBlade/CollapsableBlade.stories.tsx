import type { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import CollapsableBlade from './CollapsableBlade';
import { collapsableBladeMock } from './__mocks__/CollapsedBlade.mock';

export default {
	title: 'Components/CollapsableBlade',
	component: CollapsableBlade,
} as ComponentMeta<typeof CollapsableBlade>;

const Template: ComponentStory<typeof CollapsableBlade> = (args) => <CollapsableBlade {...args} />;

export const Default = Template.bind({});
Default.args = {
	...collapsableBladeMock,
};
