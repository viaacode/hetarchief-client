import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { IconNamesLight } from '../Icon';

import Placeholder from './Placeholder';

export default {
	title: 'Components/Placeholder',
	component: Placeholder,
} as ComponentMeta<typeof Placeholder>;

const Template: ComponentStory<typeof Placeholder> = (args) => <Placeholder {...args} />;

export const Default = Template.bind({});
Default.args = {
	title: 'This is a placeholder title',
	description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
	icon: IconNamesLight.Search,
	title: 'Geen resultaten',
	description: 'Pas je zoekopdracht aan om minder filter of trefwoorden te omvatten.',
};

export const WithImage = Template.bind({});
WithImage.args = {
	img: '/images/lightbulb.svg',
	imgAlt: 'Afbeelding van een gloeilamp',
	title: 'Start je zoek tocht!',
	description: 'Zoek op trefwoorden, jaartallen, aanbieders… en start je research.',
};
