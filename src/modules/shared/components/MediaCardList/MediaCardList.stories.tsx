import type { Meta, StoryFn } from '@storybook/react';
import { mock } from './__mocks__/media-card-list-mocks';
import MediaCardList from './MediaCardList';

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
} as Meta<typeof MediaCardList>;

const Template: StoryFn<typeof MediaCardList> = (args, { loaded: { items } }) => (
	<MediaCardList {...args} {...items} />
);

export const Grid: StoryFn<typeof MediaCardList> = Template.bind({});
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

export const List: StoryFn<typeof MediaCardList> = Template.bind({});
List.args = { ...Grid.args, view: 'list' };
List.loaders = [
	async () => ({
		items: await mock({ view: 'list' }),
	}),
];
List.parameters = {
	backgrounds: { default: 'platinum' },
};
