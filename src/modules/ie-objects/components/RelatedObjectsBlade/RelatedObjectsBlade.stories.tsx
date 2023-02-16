import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import RelatedObjectsBlade from './RelatedObjectsBlade';
import { relatedObjectsBladeMock } from './__mocks__/related-objects-blade';

export default {
	title: 'Components/RelatedObjectsBlade',
	component: RelatedObjectsBlade,
} as ComponentMeta<typeof RelatedObjectsBlade>;

const Template: ComponentStory<typeof RelatedObjectsBlade> = (args) => (
	<RelatedObjectsBlade {...args} />
);

export const Default = Template.bind({});
Default.args = {
	...relatedObjectsBladeMock,
};
