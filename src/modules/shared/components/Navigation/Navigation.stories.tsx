import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Navigation from './Navigation';
import { MOCK_ITEMS_LEFT, MOCK_ITEMS_RIGHT } from './__mocks__/navigation';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: 'Components/Navigation',
	component: Navigation,
} as ComponentMeta<typeof Navigation>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Navigation> = (args) => (
	<Navigation {...args}>
		<Navigation.Left
			placement="left"
			renderHamburger={true}
			items={MOCK_ITEMS_LEFT}
			hamburgerProps={{
				hamburgerLabelOpen: 'sluit',
				hamburgerLabelClosed: 'Menu',
				hamburgerIconOpen: 'times',
				hamburgerIconClosed: 'grid-view',
			}}
		/>
		<Navigation.Right placement="right" items={MOCK_ITEMS_RIGHT} />
	</Navigation>
);

export const Default = Template.bind({});
// Default.args = {};

export const Contextual = Template.bind({});
Contextual.args = { contextual: true };
