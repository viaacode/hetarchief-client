import { Checkbox } from '@meemoo/react-components';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';

export default {
	title: 'Components/Checkbox',
	component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
	checkIcon: <Icon name={IconNamesLight.Check} />,
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
