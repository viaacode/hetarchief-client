import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { FragmentSlider } from './FragmentSlider';
import { fragmentSliderMock } from './__mocks__/fragmentSlider';

export default {
	title: 'Components/FragmentSlider',
	component: FragmentSlider,
} as ComponentMeta<typeof FragmentSlider>;

const Template: ComponentStory<typeof FragmentSlider> = (args) => <FragmentSlider {...args} />;

export const Default = Template.bind({});
Default.args = {
	...fragmentSliderMock,
	setActiveIndex: (index: number) => action('click')(index),
};
