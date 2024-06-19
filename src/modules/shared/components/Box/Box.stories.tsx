import { Box } from '@meemoo/react-components';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import React from 'react';

import { boxChildrenMock } from './__mocks__/box';

export default {
	title: 'Components/Box',
	component: Box,
} as ComponentMeta<typeof Box>;

const Template: ComponentStory<typeof Box> = (args) => <Box {...args}>{boxChildrenMock}</Box>;

export const Default = Template.bind({});
Default.args = {};
