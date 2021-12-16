import { ComponentMeta, ComponentStory } from '@storybook/react';
import clsx from 'clsx';
import React, { FC, ReactNode } from 'react';

import { Icon } from '../Icon';

import { DefaultComponentProps } from '@shared/types';

interface TextInputPropsSchema extends DefaultComponentProps {
	id?: string;
	disabled?: boolean;
	placeholder?: string;
	value?: string;
	iconStart?: ReactNode;
	iconEnd?: ReactNode;
	type?: 'text' | 'number';
	variants: string | string[];
}

const TextInput: FC<TextInputPropsSchema> = ({
	className,
	id,
	disabled = false,
	placeholder,
	value = '',
	iconStart = null,
	iconEnd = null,
	type = 'text',
	variants,
}) => {
	// Make util for this
	const variantsArray = Array.isArray(variants) ? variants : [variants];

	const rootCls = clsx(
		className,
		'c-input',
		variantsArray.map((variant) => `c-input--${variant}`),
		{
			'c-input--disabled': disabled,
			'c-input--icon-start': iconStart,
			'c-input--icon-end': iconEnd,
		}
	);

	return (
		<div className={rootCls}>
			{iconStart && <span className="c-input__icon c-input__icon--start">{iconStart}</span>}
			<input
				className="c-input__field"
				type={type}
				id={id}
				value={value}
				disabled={disabled}
				placeholder={placeholder}
				onChange={() => null}
			/>
			{iconEnd && <span className="c-input__icon c-input__icon--end">{iconEnd}</span>}
		</div>
	);
};

export default {
	title: 'Components/TextInput',
	component: TextInput,
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
	disabled: true,
};

export const ColorGray = Template.bind({});
ColorGray.args = {
	variants: 'grey',
};

export const WithIconLeft = Template.bind({});
WithIconLeft.args = {
	placeholder: 'dd/mm/yyyy',
	iconStart: <Icon name="calendar" />,
};

export const WithIconRight = Template.bind({});
WithIconRight.args = {
	placeholder: 'Zoek',
	iconEnd: <Icon name="search" />,
};

export const Rounded = Template.bind({});
Rounded.args = {
	placeholder: 'Zoek',
	iconEnd: <Icon name="search" />,
	variants: ['rounded'],
};

export const SizeLarge = Template.bind({});
SizeLarge.args = {
	placeholder: 'Zoek',
	iconEnd: <Icon name="search" />,
	variants: ['lg', 'rounded'],
};
