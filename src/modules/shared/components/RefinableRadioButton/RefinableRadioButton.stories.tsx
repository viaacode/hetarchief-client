import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { RefinableRadioButton } from './RefinableRadioButton';
import { MOCK_OPTIONS } from './RefinableRadioButton.mock';

export default {
	title: 'Components/RefinableRadioButton',
	component: RefinableRadioButton,
} as ComponentMeta<typeof RefinableRadioButton>;

const Template: ComponentStory<typeof RefinableRadioButton> = (args) => (
	<RefinableRadioButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
	options: MOCK_OPTIONS,
	onChange: action('On change'),
};
