import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { cardImageMock } from './__mocks__/card-image';
import CardImage from './CardImage';

export default {
	title: 'Components/CardImage',
	component: CardImage,
} as Meta<typeof CardImage>;

const Template: StoryFn<typeof CardImage> = (args) => <CardImage {...args} />;

export const Short = Template.bind({});
Short.args = {
	...cardImageMock,
};

export const Tall = Template.bind({});
Tall.args = {
	...cardImageMock,
	size: 'tall',
};

export const Small = Template.bind({});
Small.args = {
	...cardImageMock,
	size: 'small',
};
