import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { action } from 'storybook/actions';

import { RefinableRadioButton } from './RefinableRadioButton';
import { MOCK_OPTIONS } from './RefinableRadioButton.mock';

export default {
	title: 'Components/RefinableRadioButton',
	component: RefinableRadioButton,
} as Meta<typeof RefinableRadioButton>;

const Template: StoryFn<typeof RefinableRadioButton> = (args) => <RefinableRadioButton {...args} />;

export const Default = Template.bind({});
Default.args = {
	id: 'refinable-radio-button',
	options: MOCK_OPTIONS,
	value: {
		selectedOption: 'type-1',
		refinedSelection: [],
	},
	onChange: action('On change'),
};
