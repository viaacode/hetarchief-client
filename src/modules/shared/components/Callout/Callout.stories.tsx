import { Button } from '@meemoo/react-components';
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon } from '../Icon';

import Callout from './Callout';

export default {
	title: 'Components/Callout',
	component: Callout,
} as ComponentMeta<typeof Callout>;

const Template: ComponentStory<typeof Callout> = (args) => <Callout {...args} />;

export const Default = Template.bind({});
Default.args = {
	icon: <Icon name="info" />,
	text: 'Door gebruik te maken van deze applicatie bevestigt u dat u het beschikbare materiaal enkel raadpleegt voor wetenschappelijk- of privé onderzoek.',
	action: { label: 'Meer info', onClick: () => action('click')() },
};
