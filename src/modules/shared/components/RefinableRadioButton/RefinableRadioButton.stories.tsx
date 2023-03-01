import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { RefinableRadioButton } from './RefinableRadioButton';

export default {
	title: 'Components/RefinableRadioButton',
	component: RefinableRadioButton,
} as ComponentMeta<typeof RefinableRadioButton>;

const MOCK_OPTIONS = [
	{
		id: 'type-1',
		label: 'type 1',
	},
	{
		id: 'type-2',
		label: 'type 2',
		refine: {
			info: 'Info label',
			options: [
				{
					id: 'refine-option-1',
					label: 'refine-option-1',
				},
				{
					id: 'refine-option-2',
					label: 'refine-option-2',
				},
				{
					id: 'refine-option-3',
					label: 'refine-option-3',
				},
			],
			label: 'dynamic label',
		},
	},
];

const Template: ComponentStory<typeof RefinableRadioButton> = (args) => (
	<RefinableRadioButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
	options: MOCK_OPTIONS,
	onChange: action('On change'),
};
