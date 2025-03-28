import type { ComponentMeta, ComponentStory } from '@storybook/react';

import MediaCardList from './MediaCardList';
import { mock } from './__mocks__/media-card-list-mocks';

export default {
	title: 'Components/MediaCardList',
	component: MediaCardList,
	parameters: {
		backgrounds: {
			default: 'white',
			values: [
				{ name: 'white', value: '#FFFFFF' },
				{ name: 'platinum', value: '#F8F8F8' },
			],
		},
	},
} as ComponentMeta<typeof MediaCardList>;

const Template: ComponentStory<typeof MediaCardList> = (args, { loaded: { items } }) => (
	<MediaCardList {...args} {...items} />
);

export const Grid: ComponentStory<typeof MediaCardList> = Template.bind({});
Grid.args = {
	view: 'grid',
	sidebar: <p style={{ textAlign: 'center' }}>&lt;sidebar&gt;</p>,
};
Grid.loaders = [
	async () => ({
		items: await mock({ view: 'grid' }, 0, 100),
	}),
];
Grid.parameters = {
	backgrounds: { default: 'platinum' },
};

export const List: ComponentStory<typeof MediaCardList> = Template.bind({});
List.args = { ...Grid.args, view: 'list' };
List.loaders = [
	async () => ({
		items: await mock({ view: 'list' }),
	}),
];
List.parameters = {
	backgrounds: { default: 'platinum' },
};
