import type { Meta, StoryFn } from '@storybook/react';
import { sixItems } from './__mocks__/visitor-space-card-list';
import VisitorSpaceCardList from './VisitorSpaceCardList';

export default {
	title: 'Components/VisitorSpaceCardList',
	component: VisitorSpaceCardList,
} as Meta<typeof VisitorSpaceCardList>;

const Template: StoryFn<typeof VisitorSpaceCardList> = (args) => <VisitorSpaceCardList {...args} />;

export const Primary: StoryFn<typeof VisitorSpaceCardList> = Template.bind({});
Primary.args = {
	items: sixItems,
};
