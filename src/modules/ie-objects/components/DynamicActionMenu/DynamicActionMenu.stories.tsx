import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { action } from 'storybook/actions';
import { dynamicActionMenuMock } from './__mocks__/dynamic-action-menu';
import DynamicActionMenu from './DynamicActionMenu';

export default {
	title: 'Components/DynamicActionMenu',
	component: DynamicActionMenu,
} as Meta<typeof DynamicActionMenu>;

const Template: StoryFn<typeof DynamicActionMenu> = (args) => (
	<div style={{ backgroundColor: 'beige', width: '50vw', padding: '1rem 0' }}>
		<p>Vergroot/verklein het scherm om de overflow in actie te zien.</p>
		<p>Altijd zichtbaar: {dynamicActionMenuMock.limit} items</p>
		<DynamicActionMenu {...args} />
	</div>
);

export const Default = Template.bind({});
Default.args = {
	...dynamicActionMenuMock,
	onClickAction: (id) => action(id)(),
};
