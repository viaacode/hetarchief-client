import { ComponentMeta, ComponentStory } from '@storybook/react';
import clsx from 'clsx';
import React, { FC, ReactNode } from 'react';

import { Icon } from '../Icon';

import { DefaultComponentProps } from '@shared/types';

export interface CheckboxPropsSchema extends DefaultComponentProps {
	label: string | ReactNode;
	checked?: boolean;
	id?: string;
	disabled?: boolean;
	onChange?: () => void;
	checkIcon?: ReactNode;
}

const Checkbox: FC<CheckboxPropsSchema> = ({
	className,
	label,
	id,
	disabled = false,
	checked = false,
	onChange = () => null,
	checkIcon,
}) => {
	return (
		<label
			className={clsx(className, 'c-checkbox', {
				'c-checkbox--checked': checked,
				'c-checkbox--disabled': disabled,
			})}
		>
			<input
				className="c-checkbox__input"
				type="checkbox"
				id={id}
				checked={checked}
				disabled={disabled}
				onChange={onChange}
			/>
			<span className="c-checkbox__check-icon">{checkIcon}</span>
			{label}
		</label>
	);
};

export default {
	title: 'Components/Checkbox',
	component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
	checkIcon: <Icon name="check" />,
	checked: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
	...Default.args,
	disabled: true,
};

export const Checked = Template.bind({});
Checked.args = {
	...Default.args,
	checked: true,
};

export const WithLabel = Template.bind({});
WithLabel.args = {
	...Default.args,
	label: 'Accept my terms and conditions',
};
