import { TagList } from '@meemoo/react-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { Icon } from '../Icon';

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

export const Large = Template.bind({});
Large.args = {
	tags: tags,
	variants: ['large'],
};

export const LargeClosable = Template.bind({});
LargeClosable.args = {
	tags: tags,
	closeIcon: <Icon name="times" />,
	onTagClosed: () => console.log('close'),
	variants: ['large', 'closable'],
};

export const Medium = Template.bind({});
Medium.args = {
	tags: tags,
	onTagClicked: () => console.log('clicked'),
	variants: ['medium', 'clickable'],
};

export const Small = Template.bind({});
Small.args = {
	tags: tags,
	variants: ['small'],
};
