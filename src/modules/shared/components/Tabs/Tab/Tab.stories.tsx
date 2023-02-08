import { Tab } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon, IconNamesLight } from '../../Icon';

export default {
	title: 'Components/Tab',
	component: Tab,
} as ComponentMeta<typeof Tab>;

const Template: ComponentStory<typeof Tab> = (args) => <Tab {...args} />;

export const Default = Template.bind({});
Default.args = {
	id: 'tab-id',
	label: 'Tab me!',
	active: false,
};

export const Active = Template.bind({});
Active.args = {
	id: 'tab-id',
	label: 'Tab me!',
	active: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
	id: 'tab-id',
	label: 'Audio',
	active: false,
	icon: <Icon name={IconNamesLight.Audio} />,
};

export const WithCustomLabel = Template.bind({});
WithCustomLabel.args = {
	id: 'tab-id',
	label: (
		<>
			<strong className="u-mr-8">Video</strong>
			<small>(52)</small>
		</>
	),
	active: false,
	icon: <Icon name={IconNamesLight.Video} />,
};
