import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import RelatedObject from './RelatedObject';
import { relatedObjectEmptyMock, relatedObjectVideoMock } from './__mocks__/related-object';

export default {
	title: 'Components/RelatedObject',
	component: RelatedObject,
} as ComponentMeta<typeof RelatedObject>;

const Template: ComponentStory<typeof RelatedObject> = (args) => <RelatedObject {...args} />;

export const Default = Template.bind({});
Default.args = {
	...relatedObjectVideoMock,
};

export const Empty = Template.bind({});
Empty.args = {
	...relatedObjectEmptyMock,
};
