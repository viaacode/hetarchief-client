import { NotificationCenterProps } from '../NotificationCenter.types';

export const notificationsMock = [
	{
		title: 'Aanvraag goedgekeurd',
		description: (
			<p className="u-font-size-14 u-color-neutral u-line-height-13">
				Jouw aanvraag coor <b>Leeszaal 6</b> is goedgekeurd. Je hebt toegang t.e.m. 12
				augustus 2021, 17:00.
			</p>
		),
		read: false,
		id: 'aanvraag - leeszaal 6 - 12 augustus',
	},
	{
		title: 'Aanvraag goedgekeurd',
		description: (
			<p className="u-font-size-14 u-color-neutral u-line-height-13">
				Jouw aanvraag coor <b>Leeszaal 8</b> is goedgekeurd. Je hebt toegang t.e.m. 14
				augustus 2021, 17:00.
			</p>
		),
		read: true,
		id: 'aanvraag - leeszaal 8 - 14 augustus',
	},
];

export const notificationCenterMock: NotificationCenterProps = {
	notifications: [
		...notificationsMock,
		{
			title: 'Aanvraag goedgekeurd',
			description: (
				<p className="u-font-size-14 u-color-neutral u-line-height-13">
					Jouw aanvraag coor <b>Leeszaal 7</b> is goedgekeurd. Je hebt toegang t.e.m. 13
					augustus 2021, 17:00.
				</p>
			),
			read: false,
			id: 'aanvraag - leeszaal 7 - 13 augustus',
		},
		{
			title: 'Aanvraag goedgekeurd',
			description: (
				<p className="u-font-size-14 u-color-neutral u-line-height-13">
					Jouw aanvraag coor <b>Leeszaal 9</b> is goedgekeurd. Je hebt toegang t.e.m. 13
					augustus 2021, 17:00.
				</p>
			),
			read: false,
			id: 'aanvraag - leeszaal 9 - 13 augustus',
		},
		{
			title: 'Aanvraag goedgekeurd',
			description: (
				<p className="u-font-size-14 u-color-neutral u-line-height-13">
					Jouw aanvraag coor <b>Leeszaal 2</b> is goedgekeurd. Je hebt toegang t.e.m. 14
					augustus 2021, 17:00.
				</p>
			),
			read: true,
			id: 'aanvraag - leeszaal 2 - 14 augustus',
		},
	],
	isOpen: true,
	onClose: () => null,
	onClickButton: () => null,
	onClickNotification: () => null,
};
