import { ComponentMeta, ComponentStory } from '@storybook/react';

import MediaCard from './MediaCard';

export default {
	title: 'Components/MediaCard',
	component: MediaCard,
} as ComponentMeta<typeof MediaCard>;

const Template: ComponentStory<typeof MediaCard> = () => <MediaCard />;

export const Primary: ComponentStory<typeof MediaCard> = Template.bind({});
