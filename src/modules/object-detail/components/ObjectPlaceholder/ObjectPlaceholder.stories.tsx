import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import ObjectPlaceholder from './ObjectPlaceholder';

export default {
	title: 'Components/ObjectPlaceholder',
	component: ObjectPlaceholder,
} as ComponentMeta<typeof ObjectPlaceholder>;

const Template: ComponentStory<typeof ObjectPlaceholder> = (args) => (
	<div style={{ height: '90vh', width: '50vw' }}>
		<ObjectPlaceholder {...args} />
	</div>
);

export const Default = Template.bind({});
Default.args = {
	description: 'Je kan de object enkel bekijken tijdens een fysiek bezoek aan de leeszaal.',
	reasonTitle: 'Waarom kan ik dit object niet bekijken?',
	reasonDescription:
		'Sed augue ipsum, egestas nec, vestibulum et, malesuada adipiscing, dui. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor. Mauris sollicitudin fermentum libero. Praesent nonummy mi in odio. Nunc interdum lacus sit amet orci. Vestibulum rutrum, mi nec elementum vehicula, eros quam gravida nisl, id fringilla neque ante vel mi. Morbi mollis tellus ac sapien. Phasellus volutpat, metus eget egestas mollis, lacus lacus blandit dui',
	openModalButtonLabel: 'Meer info',
	closeModalButtonLabel: 'Sluit',
};
