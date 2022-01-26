import { NotificationCenterProps } from '../NotificationCenter.types';

export const notificationsMock = [
	{
		title: 'Aanvraag goedgekeurd',
		description:
			'Jouw aanvraag coor Leeszaal 6 is goedgekeurd. Je hebt toegang t.e.m. 12 augustus 2021, 17:00.',
		read: false,
		id: 'aanvraag - leeszaal 6 - 12 augustus',
	},
	{
		title: 'Aanvraag goedgekeurd',
		description:
			'Jouw aanvraag coor Leeszaal 8 is goedgekeurd. Je hebt toegang t.e.m. 14 augustus 2021, 17:00.',
		read: true,
		id: 'aanvraag - leeszaal 8 - 14 augustus',
	},
];

export const notificationCenterMock: NotificationCenterProps = {
	notifications: [
		...notificationsMock,
		{
			title: 'Aanvraag goedgekeurd',
			description:
				'Jouw aanvraag coor Leeszaal 7 is goedgekeurd. Je hebt toegang t.e.m. 13 augustus 2021, 17:00.',
			read: false,
			id: 'aanvraag - leeszaal 7 - 13 augustus',
		},
		{
			title: 'Aanvraag goedgekeurd',
			description:
				'Jouw aanvraag coor Leeszaal 9 is goedgekeurd. Je hebt toegang t.e.m. 13 augustus 2021, 17:00.',
			read: false,
			id: 'aanvraag - leeszaal 9 - 13 augustus',
		},
		{
			title: 'Aanvraag goedgekeurd',
			description:
				'Jouw aanvraag coor Leeszaal 2 is goedgekeurd. Je hebt toegang t.e.m. 14 augustus 2021, 17:00.',
			read: true,
			id: 'aanvraag - leeszaal 2 - 14 augustus',
		},
	],
	isOpen: true,
	readTitle: 'Gelezen',
	unreadTitle: 'Ongelezen',
	buttonTitle: 'Markeer alles als gelezen',
	onClose: () => null,
	onClickButton: () => null,
	onClickNotification: () => null,
};
