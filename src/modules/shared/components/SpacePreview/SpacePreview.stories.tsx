import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import SpacePreview from './SpacePreview';
import { SPACE_PREVIEW_PROPS_MOCK } from './__mocks__/spacePreview';

export default {
	title: 'Components/SpacePreview',
	component: SpacePreview,
} as ComponentMeta<typeof SpacePreview>;

const Template: ComponentStory<typeof SpacePreview> = (args) => <SpacePreview {...args} />;

export const Default = Template.bind({});
Default.args = {
	...SPACE_PREVIEW_PROPS_MOCK,
};
