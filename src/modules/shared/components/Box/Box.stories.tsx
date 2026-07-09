import { Box } from '@meemoo/react-components';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { boxChildrenMock } from './__mocks__/box';

export default {
	title: 'Components/Box',
	component: Box,
} as Meta<typeof Box>;

const Template: StoryFn<typeof Box> = (args) => <Box {...args}>{boxChildrenMock}</Box>;

export const Default = Template.bind({});
Default.args = {};
