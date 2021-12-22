import { ComponentMeta, ComponentStory } from '@storybook/react';
import clsx from 'clsx';
import React, { FC, MouseEventHandler, ReactNode } from 'react';

import { Icon } from '../Icon';

export const Button: FC<{
	className?: string;
	icon?: ReactNode;
	iconStart?: ReactNode;
	iconEnd?: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ children, className, icon, iconStart, iconEnd, onClick }) => {
	return (
		<button className={clsx(className, 'c-button')} onClick={onClick}>
			{icon ? (
				<span className="c-button__icon">{icon}</span>
			) : (
				<>
					{iconStart && (
						<span className="c-button__icon c-button__icon--start">{iconStart}</span>
					)}
					<span className="c-button__label">{children}</span>
					{iconEnd && (
						<span className="c-button__icon c-button__icon--end">{iconEnd}</span>
					)}
				</>
			)}
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

export const TextWithIconLeft = Template.bind({});
TextWithIconLeft.args = {
	children: 'Click me!',
	iconStart: <Icon name="info" />,
};

export const TextWithIconRight = Template.bind({});
TextWithIconRight.args = {
	children: 'Click me!',
	iconEnd: <Icon name="info" />,
};

export const IconOnly = Template.bind({});
IconOnly.args = {
	className: 'c-button--icon',
	children: 'Click me!',
	icon: <Icon name="info" />,
};

export const IconOnlySmall = Template.bind({});
IconOnlySmall.args = {
	className: 'c-button--icon c-button--sm',
	children: 'Click me!',
	icon: <Icon name="info" />,
};

export const IconOnlyExtraSmall = Template.bind({});
IconOnlyExtraSmall.args = {
	className: 'c-button--icon c-button--xs',
	children: 'Click me!',
	icon: <Icon name="info" />,
};
