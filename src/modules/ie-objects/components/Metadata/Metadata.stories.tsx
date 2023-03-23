import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Metadata from './Metadata';
import { metadataMock } from './__mocks__/metadata';

export default {
	title: 'Components/Metadata',
	component: Metadata,
} as ComponentMeta<typeof Metadata>;

const Template: ComponentStory<typeof Metadata> = (args) => <Metadata {...args} />;

export const Default = Template.bind({});
Default.args = { ...metadataMock };

export const Wide = Template.bind({});
Wide.args = { ...metadataMock };
