import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Toast from './Toast';
import { toastMock } from './__mocks__/toast';

export default {
	title: 'Components/Toast',
	component: Toast,
} as ComponentMeta<typeof Toast>;

const Template: ComponentStory<typeof Toast> = (args) => <Toast {...args} />;

export const Default = Template.bind({});
Default.args = {
	...toastMock,
};

export const LongLabels = Template.bind({});
LongLabels.args = {
	...toastMock,
	title: 'De aanvraag die de bezoeker via de bezoekersruimte heeft aangevraagd werd goedgekeurd door de bezoekersruimte waar de bezoeker een aanvraag gedaan heeft',
	description:
		'Bevestiging van de aanvraag die de bezoeker via de bezoekersruimte heeft aangevraagd is verzonden naar de bezoeker die de aanvraag bij de bezoekersruimte gedaan heeft',
};

export const MultiLine = Template.bind({});
MultiLine.args = {
	...toastMock,
	title: 'Je annulering voor bezoekersruimte 4 is succesvol verstuurd',
	description:
		'Een annuleringsbevestiging van de bezoekersruimtebeheerder kan je verwachten in je mail inxox',
	maxLines: 2,
};

export const ButtonHover = Template.bind({});
ButtonHover.args = {
	...toastMock,
	buttonLabelHover: 'Hover',
};
