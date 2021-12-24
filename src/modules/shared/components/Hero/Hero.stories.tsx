import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Hero from './Hero';
import { heroMock } from './__mocks__/hero';

export default {
	title: 'Components/Hero',
	component: Hero,
} as ComponentMeta<typeof Hero>;

const Template: ComponentStory<typeof Hero> = (args) => <Hero {...args} />;

export const Default = Template.bind({});
Default.args = { ...heroMock };
