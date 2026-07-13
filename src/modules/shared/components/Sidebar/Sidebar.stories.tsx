import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import Sidebar from './Sidebar';
import styles from './Sidebar.module.scss';

export default {
	title: 'Components/Sidebar',
	component: Sidebar,
} as Meta<typeof Sidebar>;

const Template: StoryFn<typeof Sidebar> = (args) => (
	<div style={{ height: '90vh' }}>
		<Sidebar {...args} />
	</div>
);

export const Default = Template.bind({});
Default.args = {
	title: 'This is a title',
	children: (
		<div style={{ backgroundColor: 'beige', height: '100%' }}>
			This is the content area. The sidebar adjusts to the width of its children
		</div>
	),
};

export const WithCustomHeading = Template.bind({});
WithCustomHeading.args = {
	heading: <h3 className={styles['c-sidebar__title']}>This heading is a custom heading</h3>,
	children: (
		<div style={{ backgroundColor: 'beige', height: '100%' }}>
			This is the content area. The sidebar adjusts to the width of its children
		</div>
	),
};
