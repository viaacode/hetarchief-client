import { ComponentMeta, ComponentStory } from '@storybook/react';
import clsx from 'clsx';
import React, { FC } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface TextAreaPropsSchema extends DefaultComponentProps {
	id?: string;
	name?: string;
	rows?: number;
	disabled?: boolean;
	placeholder?: string;
	value?: string;
	height?: 'auto' | 'small' | 'medium' | 'large';
	width?: 'xsmall' | 'small' | 'medium' | 'large';
	onChange?: () => void;
	onBlur?: () => void;
}

const TextArea: FC<TextAreaPropsSchema> = ({
	className,
	id,
	name,
	rows,
	disabled = false,
	placeholder,
	value = '',
	height,
	width,
	onChange = () => null,
	onBlur = () => null,
}) => {
	return (
		<div
			className={clsx('c-input', 'c-input--text-area', {
				[`c-input--h-${height}`]: height && height !== 'auto',
				[`c-input--w-${width}`]: width,
				'c-input--disabled': disabled,
			})}
		>
			<textarea
				className={clsx(className, 'c-input__field')}
				id={id}
				name={name}
				rows={rows}
				disabled={disabled}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
		</div>
	);
};

export default {
	title: 'Components/TextArea',
	component: TextArea,
} as ComponentMeta<typeof TextArea>;

const Template: ComponentStory<typeof TextArea> = (args) => <TextArea {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
	disabled: true,
};
