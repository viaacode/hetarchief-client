import { TagList } from '@meemoo/react-components';
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon, IconNamesLight } from '../Icon';

const tags = [
	{
		label: (
			<span>
				<span style={{ fontWeight: 400 }}>Trefwoord: </span>Episode 1
			</span>
		),
		id: 'episode1',
	},
	{
		label: 'Aanvraag ingediend',
		id: 'aanvraag',
		disabled: true,
	},
	{
		label: 'Schepijs',
		id: 'schepijs',
	},
	{
		label: '23 items',
		id: '23items',
	},
];

export default {
	title: 'Components/TagList',
	component: TagList,
} as ComponentMeta<typeof TagList>;

const Template: ComponentStory<typeof TagList> = (args) => <TagList {...args} />;

export const Default = Template.bind({});
Default.args = {
	tags: tags,
};

export const Closable = Template.bind({});
Closable.args = {
	tags: tags,
	closeIcon: <Icon name={IconNamesLight.Times} />,
	onTagClosed: action('Closed tag'),
	variants: ['closable'],
};

export const Clickable = Template.bind({});
Clickable.args = {
	tags: tags,
	onTagClicked: action('Clicked tag'),
	variants: ['clickable'],
};

export const ColorBlack = Template.bind({});
ColorBlack.args = {
	tags: tags,
	variants: ['black'],
};

export const ColorSilver = Template.bind({});
ColorSilver.args = {
	tags: tags,
	variants: ['silver'],
};

export const SizeMedium = Template.bind({});
SizeMedium.args = {
	tags: tags,
	variants: ['medium', 'silver'],
};

export const SizeSmall = Template.bind({});
SizeSmall.args = {
	tags: tags,
	variants: ['small', 'black'],
};
