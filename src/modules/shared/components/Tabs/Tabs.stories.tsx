import { Tabs } from '@meemoo/react-components';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { mockTabs } from './__mocks__/tabs';

export default {
	title: 'Components/Tabs',
	component: Tabs,
} as Meta<typeof Tabs>;

const Template: StoryFn<typeof Tabs> = (args) => <Tabs {...args} />;

export const Default = Template.bind({});
Default.args = {
	tabs: mockTabs,
};
