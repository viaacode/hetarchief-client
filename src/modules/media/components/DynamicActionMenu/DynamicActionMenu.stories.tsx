import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import DynamicActionMenu from './DynamicActionMenu';
import { dynamicActionMenuMock } from './__mocks__/dynamic-action-menu';

export default {
	title: 'Components/DynamicActionMenu',
	component: DynamicActionMenu,
} as ComponentMeta<typeof DynamicActionMenu>;

const Template: ComponentStory<typeof DynamicActionMenu> = (args) => (
	<div style={{ backgroundColor: 'beige', width: '50vw', padding: '1rem 0' }}>
		<p>Vergroot/verklein het scerm om de overflow in actie te zien.</p>
		<p>Altijd zichtbaar: {dynamicActionMenuMock.limit} items</p>
		<DynamicActionMenu {...args} />
	</div>
);

export const Default = Template.bind({});
Default.args = {
	...dynamicActionMenuMock,
	onClickAction: (id) => action(id)(),
};
