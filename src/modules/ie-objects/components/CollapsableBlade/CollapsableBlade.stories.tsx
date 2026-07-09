import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { collapsableBladeMock } from './__mocks__/CollapsedBlade.mock';
import CollapsableBlade from './CollapsableBlade';

export default {
	title: 'Components/CollapsableBlade',
	component: CollapsableBlade,
} as Meta<typeof CollapsableBlade>;

const Template: StoryFn<typeof CollapsableBlade> = (args) => <CollapsableBlade {...args} />;

export const Default = Template.bind({});
Default.args = {
	...collapsableBladeMock,
};
