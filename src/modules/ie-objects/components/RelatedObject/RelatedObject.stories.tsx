import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { relatedObjectEmptyMock, relatedObjectVideoMock } from './__mocks__/related-object';
import RelatedObject from './RelatedObject';

export default {
	title: 'Components/RelatedObject',
	component: RelatedObject,
} as Meta<typeof RelatedObject>;

const Template: StoryFn<typeof RelatedObject> = (args) => <RelatedObject {...args} />;

export const Default = Template.bind({});
Default.args = {
	...relatedObjectVideoMock,
};

export const Empty = Template.bind({});
Empty.args = {
	...relatedObjectEmptyMock,
};
