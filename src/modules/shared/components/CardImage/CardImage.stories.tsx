import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import CardImage from './CardImage';
import { cardImageMock } from './__mocks__/card-image';

export default {
	title: 'Components/CardImage',
	component: CardImage,
} as ComponentMeta<typeof CardImage>;

const Template: ComponentStory<typeof CardImage> = (args) => <CardImage {...args} />;

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
