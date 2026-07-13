import { Button } from '@meemoo/react-components';
import type { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';
import { action } from 'storybook/actions';
import { notificationCenterMock } from './__mocks__/notification-center';
import NotificationCenter from './NotificationCenter';
import type { NotificationCenterProps } from './NotificationCenter.types';

const NotificationCenterStoryComponent = ({ args }: { args: NotificationCenterProps }) => {
	const [isOpen, setOpen] = useState(false);

	const open = () => {
		action('onOpen')();
		setOpen(true);
	};

	const close = () => {
		action('onClose')();
		setOpen(false);
	};

	return (
		<>
			<div>
				<h1>Notifications</h1>
				<Button label="Open" onClick={open} />
			</div>
			<NotificationCenter {...notificationCenterMock} {...args} onClose={close} isOpen={isOpen} />
		</>
	);
};

export default {
	title: 'Components/NotificationCenter',
	component: NotificationCenter,
} as Meta<typeof NotificationCenter>;

const Template: StoryFn<typeof NotificationCenter> = (args) => (
	<NotificationCenterStoryComponent args={args} />
);

export const Default = Template.bind({});
Default.args = {};
