import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { SPACE_PREVIEW_PROPS_MOCK } from './__mocks__/spacePreview';
import SpacePreview from './SpacePreview';

export default {
	title: 'Components/SpacePreview',
	component: SpacePreview,
} as Meta<typeof SpacePreview>;

const Template: StoryFn<typeof SpacePreview> = (args) => <SpacePreview {...args} />;

export const Default = Template.bind({});
Default.args = {
	...SPACE_PREVIEW_PROPS_MOCK,
};
