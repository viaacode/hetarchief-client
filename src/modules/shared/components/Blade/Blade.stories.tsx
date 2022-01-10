import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Blade from './Blade';

export default {
	title: 'Components/Blade',
	component: Blade,
} as ComponentMeta<typeof Blade>;

const Template: ComponentStory<typeof Blade> = (args) => (
	<>
		<div>
			<h1>Title</h1>
			<p>Some content</p>
		</div>
		<Blade {...args} />
	</>
);

export const Default = Template.bind({});
Default.args = {};
