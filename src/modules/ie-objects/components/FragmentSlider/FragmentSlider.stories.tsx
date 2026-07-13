import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { action } from 'storybook/actions';
import { fragmentSliderMock } from './__mocks__/fragmentSlider';
import { FragmentSlider } from './FragmentSlider';

export default {
	title: 'Components/FragmentSlider',
	component: FragmentSlider,
} as Meta<typeof FragmentSlider>;

const Template: StoryFn<typeof FragmentSlider> = (args) => <FragmentSlider {...args} />;

export const Default = Template.bind({});
Default.args = {
	...fragmentSliderMock,
	setActiveIndex: (index: number) => action('click')(index),
};
