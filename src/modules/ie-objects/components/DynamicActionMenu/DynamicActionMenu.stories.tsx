import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { action } from 'storybook/actions';
import { dynamicActionMenuMock } from './__mocks__/dynamic-action-menu';
import DynamicActionMenu from './DynamicActionMenu';

export default {
	title: 'Components/DynamicActionMenu',
	component: DynamicActionMenu,
	args: {
		...dynamicActionMenuMock,
		// Same styling as in the object detail page header
		primaryButtonVariants: ['black', 'md'],
		secondaryButtonVariants: ['white'],
		onClickAction: (id) => action(id)(),
	},
} as Meta<typeof DynamicActionMenu>;

const renderInWidth =
	(width: string, description: string): StoryFn<typeof DynamicActionMenu> =>
	(args) => (
		<div style={{ backgroundColor: 'beige', width, padding: '1rem' }}>
			<p>{description}</p>
			<DynamicActionMenu {...args} />
		</div>
	);

export const AllActionsFit = renderInWidth(
	'700px',
	'Genoeg ruimte: alle acties staan op één rij.'
).bind({});

export const SomeActionsInDropdown = renderInWidth(
	'520px',
	'Beperkte ruimte: enkele secundaire acties passen nog, de rest zit in de ...-knop.'
).bind({});

export const OnlyPrimaryAndDropdown = renderInWidth(
	'380px',
	'Weinig ruimte: enkel de primaire actie (volledig leesbaar) en de ...-knop met alle andere acties.'
).bind({});

export const TruncatedPrimaryLabel = renderInWidth(
	'260px',
	'Te weinig ruimte voor het volledige label: de primaire actie wordt afgekort zodat de ...-knop zichtbaar blijft.'
).bind({});

export const OnlyOneSecondaryAction = renderInWidth(
	'420px',
	'Met één secundaire actie is er geen ...-knop: die zou evenveel plaats innemen.'
).bind({});
OnlyOneSecondaryAction.args = {
	actions: dynamicActionMenuMock.actions.slice(0, 2),
};

export const PrimaryActionOnly = renderInWidth('380px', 'Enkel een primaire actie.').bind({});
PrimaryActionOnly.args = {
	actions: dynamicActionMenuMock.actions.slice(0, 1),
};

export const Resizable: StoryFn<typeof DynamicActionMenu> = (args) => (
	<div
		style={{
			backgroundColor: 'beige',
			width: '700px',
			minWidth: '120px',
			maxWidth: '100%',
			padding: '1rem',
			resize: 'horizontal',
			overflow: 'auto',
		}}
	>
		<p>Sleep rechtsonder om de breedte aan te passen.</p>
		<DynamicActionMenu {...args} />
	</div>
);
