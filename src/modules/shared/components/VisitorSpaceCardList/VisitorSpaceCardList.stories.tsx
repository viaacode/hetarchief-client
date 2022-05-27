import { ComponentMeta, ComponentStory } from '@storybook/react';

import VisitorSpaceCardList from './VisitorSpaceCardList';
import { sixItems } from './__mocks__/visitor-space-card-list';

export default {
	title: 'Components/VisitorSpaceCardList',
	component: VisitorSpaceCardList,
} as ComponentMeta<typeof VisitorSpaceCardList>;

const Template: ComponentStory<typeof VisitorSpaceCardList> = (args) => (
	<VisitorSpaceCardList {...args} />
);

export const Primary: ComponentStory<typeof VisitorSpaceCardList> = Template.bind({});
Primary.args = {
	items: sixItems,
};
