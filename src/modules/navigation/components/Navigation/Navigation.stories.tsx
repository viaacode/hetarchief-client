import { Button } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon, IconNamesLight } from '@shared/components';

import Navigation from './Navigation';
import { MOCK_HAMBURGER_PROPS, MOCK_ITEMS_LEFT, MOCK_ITEMS_RIGHT } from './__mocks__/navigation';

export default {
	title: 'Components/Navigation',
	component: Navigation,
} as ComponentMeta<typeof Navigation>;

const Template: ComponentStory<typeof Navigation> = (args) => (
	<Navigation {...args} showBorder>
		<Navigation.Left
			placement="left"
			renderHamburger={true}
			items={MOCK_ITEMS_LEFT}
			hamburgerProps={MOCK_HAMBURGER_PROPS}
		/>
		<Navigation.Right placement="right" items={MOCK_ITEMS_RIGHT} />
	</Navigation>
);

const ContextualTemplate: ComponentStory<typeof Navigation> = (args) => (
	<Navigation {...args}>
		<Navigation.Left placement="left">
			<a className="u-font-size-24" href="#">
				<Icon name={IconNamesLight.AngleLeft} />
			</a>
		</Navigation.Left>
		<Navigation.Center title="Bezoekersruimte 8" />
		<Navigation.Right placement="right">
			<Button
				className="u-color-white u-px-12"
				iconStart={<Icon className="u-font-size-24" name={IconNamesLight.Contact} />}
				label="Contacteer"
				variants="text"
			/>
		</Navigation.Right>
	</Navigation>
);

export const Default = Template.bind({});
// Default.args = {};

export const Contextual = ContextualTemplate.bind({});
Contextual.args = { contextual: true };
