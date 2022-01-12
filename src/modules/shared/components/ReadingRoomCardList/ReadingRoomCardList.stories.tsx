import { ComponentMeta, ComponentStory } from '@storybook/react';

import ReadingRoomCardList from './ReadingRoomCardList';
import { sixItems } from './__mocks__/reading-room-card-list';

export default {
	title: 'Components/ReadingRoomCardList',
	component: ReadingRoomCardList,
} as ComponentMeta<typeof ReadingRoomCardList>;

const Template: ComponentStory<typeof ReadingRoomCardList> = (args) => (
	<ReadingRoomCardList {...args} />
);

export const Primary: ComponentStory<typeof ReadingRoomCardList> = Template.bind({});
Primary.args = {
	items: sixItems,
};
