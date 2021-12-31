import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Toast from './Toast';

export default {
	title: 'Components/Toast',
	component: Toast,
} as ComponentMeta<typeof Toast>;

const Template: ComponentStory<typeof Toast> = (args) => <Toast {...args} />;

export const Default = Template.bind({});
Default.args = {
	title: 'Aanvraag goedgekeurd',
	description: 'Bevestiging verzonden naar bezoeker',
	buttonLabel: 'Ok',
};

export const LongLabels = Template.bind({});
LongLabels.args = {
	title: 'De aanvraag die de bezoeker via de leeszaal heeft aangevraagd werd goedgekeurd door de leeszaal waar de bezoeker een aanvraag gedaan heeft',
	description:
		'Bevestiging van de aanvraag die de bezoeker via de leeszaal heeft aangevraagd is verzonden naar de bezoeker die de aanvraag bij de leeszaal gedaan heeft',
	buttonLabel: 'Ok',
};

export const MultiLine = Template.bind({});
MultiLine.args = {
	title: 'Je annulering voor leeszaal 4 is succesvol verstuurd',
	description:
		'Een annuleringsbevestiging van de leeszaalbeheerder kan je verwachten in je mail inxox',
	buttonLabel: 'Ok',
	maxLines: 2,
};
