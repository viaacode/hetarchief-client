import { Tabs } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon } from '../Icon';

const mockTabs = [
	{
		id: 'all',
		label: (
			<>
				<strong className="u-mr-8">Alles</strong>
				<small>(52)</small>
			</>
		) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
		// TODO: remove any once Tab type supports ReactNode
	},
	{
		id: 'audio',
		label: (
			<>
				<strong className="u-mr-8">Audio</strong>
				<small>(52)</small>
			</>
		) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
		// TODO: remove any once Tab type supports ReactNode
		icon: <Icon name="audio" />,
	},
	{
		id: 'video',
		label: (
			<>
				<strong className="u-mr-8">Video</strong>
				<small>(0)</small>
			</>
		) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
		// TODO: remove any once Tab type supports ReactNode
		icon: <Icon name="video" />,
	},
];

export default {
	title: 'Components/Tabs',
	component: Tabs,
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = (args) => <Tabs {...args} />;

export const Default = Template.bind({});
Default.args = {
	tabs: mockTabs,
};
