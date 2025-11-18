import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Callout from './Callout';

export default {
	title: 'Components/Callout',
	component: Callout,
} as ComponentMeta<typeof Callout>;

const Template: ComponentStory<typeof Callout> = (args) => <Callout {...args} />;

export const Default = Template.bind({});
Default.args = {
	icon: <Icon name={IconNamesLight.Info} />,
	text: 'Door gebruik te maken van deze applicatie bevestigt u dat u het beschikbare materiaal enkel raadpleegt voor wetenschappelijk- of privé onderzoek.',
	// biome-ignore lint/a11y/noStaticElementInteractions: this is a storybook file, not actual production code
	// biome-ignore lint/a11y/useKeyWithClickEvents: this is a storybook file, not actual production code
	action: <span onClick={() => action('click')()}>Meer info</span>,
};
