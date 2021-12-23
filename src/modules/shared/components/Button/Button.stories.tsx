import { ComponentMeta, ComponentStory } from '@storybook/react';
import clsx from 'clsx';
import React, { FC } from 'react';

const Button: FC<{ className?: string }> = ({ children, className }) => {
	return (
		<button className={clsx(className, 'c-button')}>
			<span>{children}</span>
		</button>
	);
};

export default {
	title: 'Components/Button',
	component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
	children: 'Click me!',
};

export const Disabled = Template.bind({});
Disabled.args = {
	className: 'c-button--disabled',
	children: 'Click me!',
};

export const Outline = Template.bind({});
Outline.args = {
	className: 'c-button--outline',
	children: 'Click me!',
};

export const OutlineDisabled = Template.bind({});
OutlineDisabled.args = {
	className: 'c-button--outline c-button--disabled',
	children: 'Click me!',
};

export const Text = Template.bind({});
Text.args = {
	className: 'c-button--text',
	children: 'Click me!',
};

export const TextNeutral = Template.bind({});
TextNeutral.args = {
	className: 'c-button--text c-button--neutral c-button--underline',
	children: 'Click me!',
};

export const TextDisabled = Template.bind({});
TextDisabled.args = {
	className: 'c-button--text c-button--disabled',
	children: 'Click me!',
};

// Colors
export const ColorBlack = Template.bind({});
ColorBlack.args = {
	className: 'c-button--black',
	children: 'Click me!',
};

export const ColorWhite = Template.bind({});
ColorWhite.args = {
	className: 'c-button--white',
	children: 'Click me!',
};

// Sizes
export const SizeBlock = Template.bind({});
SizeBlock.args = {
	className: 'c-button--block',
	children: 'Click me!',
};

export const SizeSmall = Template.bind({});
SizeSmall.args = {
	className: 'c-button--sm',
	children: 'Click me!',
};
