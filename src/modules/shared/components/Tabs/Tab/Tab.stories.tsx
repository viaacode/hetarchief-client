import { Tab } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
	title: 'Components/Tab',
	component: Tab,
} as Meta<typeof Tab>;

const Template: StoryFn<typeof Tab> = (args) => <Tab {...args} />;

export const Default = Template.bind({});
Default.args = {
	id: 'tab-id',
	label: 'Tab me!',
	ariaLabel: 'Tab me!',
	active: false,
};

export const Active = Template.bind({});
Active.args = {
	id: 'tab-id',
	label: 'Tab me!',
	ariaLabel: 'Tab me!',
	active: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
	id: 'tab-id',
	label: 'Audio',
	ariaLabel: 'Audio',
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
	ariaLabel: 'Video',
	active: false,
	icon: <Icon name={IconNamesLight.Video} />,
};
