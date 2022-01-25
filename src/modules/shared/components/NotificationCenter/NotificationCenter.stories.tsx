import { Button } from '@meemoo/react-components';
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';

import NotificationCenter from './NotificationCenter';
import { NotificationCenterProps } from './NotificationCenter.types';
import { notificationCenterMock } from './__mocks__/notificationCenter';

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
			<NotificationCenter
				{...notificationCenterMock}
				{...args}
				onClose={close}
				isOpen={isOpen}
				onClickNotification={(id) => action(id)()}
				onClickButton={() => action('read all notifications')()}
			/>
		</>
	);
};

export default {
	title: 'Components/NotificationCenter',
	component: NotificationCenter,
} as ComponentMeta<typeof NotificationCenter>;

const Template: ComponentStory<typeof NotificationCenter> = (args) => (
	<NotificationCenterStoryComponent args={args} />
);

export const Default = Template.bind({});
Default.args = {};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
	notifications: notificationCenterMock.notifications.filter(
		(notification) => notification.read === true
	),
};

export const UnreadOnly = Template.bind({});
UnreadOnly.args = {
	notifications: notificationCenterMock.notifications.filter(
		(notification) => notification.read === false
	),
};
