import { Button } from '@meemoo/react-components';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

export default {
	title: 'Components/Button',
	component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
	children: 'Click me!',
	variants: 'black',
};

export const Disabled = Template.bind({});
Disabled.args = {
	children: 'Click me!',
	disabled: true,
};

export const Outline = Template.bind({});
Outline.args = {
	children: 'Click me!',
	variants: 'outline',
};

export const OutlineDisabled = Template.bind({});
OutlineDisabled.args = {
	children: 'Click me!',
	disabled: true,
	variants: 'outline',
};

export const Text = Template.bind({});
Text.args = {
	children: 'Click me!',
	variants: 'text',
};

export const TextNeutral = Template.bind({});
TextNeutral.args = {
	children: 'Click me!',
	variants: ['text', 'neutral', 'underline'],
};

export const TextDisabled = Template.bind({});
TextDisabled.args = {
	children: 'Click me!',
	variants: 'text',
	disabled: true,
};

// Colors
export const ColorTeal = Template.bind({});
ColorTeal.args = {
	children: 'Click me!',
};

export const ColorWhite = Template.bind({});
ColorWhite.args = {
	children: 'Click me!',
	variants: 'white',
};

export const ColorSilver = Template.bind({});
ColorSilver.args = {
	children: 'Click me!',
	variants: 'silver',
};

// Sizes
export const SizeBlock = Template.bind({});
SizeBlock.args = {
	children: 'Click me!',
	variants: ['block', 'black'],
};

export const SizeSmall = Template.bind({});
SizeSmall.args = {
	children: 'Click me!',
	variants: ['sm', 'black'],
};

export const TextWithIconLeft = Template.bind({});
TextWithIconLeft.args = {
	children: 'Click me!',
	iconStart: <Icon name={IconNamesLight.Info} />,
};

export const TextWithIconRight = Template.bind({});
TextWithIconRight.args = {
	children: 'Click me!',
	iconEnd: <Icon name={IconNamesLight.Info} />,
};

export const IconOnly = Template.bind({});
IconOnly.args = {
	icon: <Icon name={IconNamesLight.Info} />,
	title: 'Info',
	variants: 'black',
};

export const IconOnlySmall = Template.bind({});
IconOnlySmall.args = {
	icon: <Icon name={IconNamesLight.Info} />,
	title: 'Info',
	variants: ['sm', 'black'],
};

export const IconOnlyExtraSmall = Template.bind({});
IconOnlyExtraSmall.args = {
	icon: <Icon name={IconNamesLight.Info} />,
	title: 'Info',
	variants: ['xs', 'black'],
};
