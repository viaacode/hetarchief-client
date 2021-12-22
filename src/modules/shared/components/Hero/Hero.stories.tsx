import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Hero from './Hero';

export default {
	title: 'Components/Hero',
	component: Hero,
} as ComponentMeta<typeof Hero>;

const Template: ComponentStory<typeof Hero> = (args) => <Hero {...args} />;

export const Default = Template.bind({});
Default.args = {
	title: 'Welkom in de digitale leeszaal',
	description:
		'Plan een nieuw bezoek, stap fysiek binnen en krijg meteen toegang tot het digitale archief van de leeszaal. Benieuwd hoe het werkt? Hier kom je er alles over te weten.',
	link: { label: 'Hier kom je er alles over te weten.', to: '/' },
	image: { name: 'hero.png', alt: '' },
};
