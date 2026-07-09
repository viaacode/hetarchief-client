import { ColorPicker } from '@meemoo/react-components';
import type { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';
import { action } from 'storybook/actions';

export default {
	title: 'Components/ColorPicker',
	component: ColorPicker,
	argTypes: {
		color: {
			control: {
				type: 'color',
			},
		},
	},
} as Meta<typeof ColorPicker>;

const Template: StoryFn<typeof ColorPicker> = (args) => {
	const [color, setColor] = useState<string>(args.color as string);

	return (
		<ColorPicker
			{...args}
			color={color}
			onChange={(newColor: string) => {
				action('color changed')(newColor);
				setColor(newColor);
			}}
		/>
	);
};

export const Default = Template.bind({});
Default.args = {
	color: '#00c8aa',
};

export const DefaultColor = Template.bind({});
DefaultColor.args = {
	color: '#FF0000',
};

export const Disabled = Template.bind({});
Disabled.args = {
	color: '#00c8aa',
	disabled: true,
};
