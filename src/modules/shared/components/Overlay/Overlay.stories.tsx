import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { CSSProperties } from 'react';

import Overlay from './Overlay';

export default {
	title: 'Components/Overlay',
	component: Overlay,
} as ComponentMeta<typeof Overlay>;

const Template: ComponentStory<typeof Overlay> = (args) => (
	<>
		<div>
			<h1>Title</h1>
			<p>Some content</p>
		</div>
		<Overlay {...args} />
	</>
);

export const Dark = Template.bind({});
Dark.args = {
	type: 'dark',
	visible: true,
};

export const Light = Template.bind({});
Light.args = {
	type: 'light',
	visible: true,
};
