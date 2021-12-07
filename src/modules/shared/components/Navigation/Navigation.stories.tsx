import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Navigation from './Navigation';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: 'Components/Navigation',
	component: Navigation,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		backgroundColor: { control: 'color' },
	},
} as ComponentMeta<typeof Navigation>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Navigation> = (args) => <Navigation {...args} />;

export const Primary = Template.bind({});
