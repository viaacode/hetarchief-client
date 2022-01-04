import { Box } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { boxChildrenMock } from './__mocks__';

export default {
	title: 'Components/Box',
	component: Box,
} as ComponentMeta<typeof Box>;

const Template: ComponentStory<typeof Box> = (args) => <Box {...args}>{boxChildrenMock}</Box>;

export const Default = Template.bind({});
Default.args = {};
