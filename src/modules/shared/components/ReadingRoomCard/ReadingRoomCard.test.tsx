import { documentOf } from '@meemoo/react-components';
import { render, RenderResult, screen } from '@testing-library/react'; //eslint-disable-line

import ReadingRoomCard from './ReadingRoomCard';
import { AccessGranted, AccessRequested, mockReadingRoomCardProps } from './ReadingRoomCard.mock';
import styles from './ReadingRoomCard.module.scss';
import { ReadingRoomCardProps } from './ReadingRoomCard.types';

import { ReadingRoomCardType } from '.';

describe('Component: <ReadingRoomCard />', () => {
	let rendered: RenderResult | undefined;

	const template = (args?: ReadingRoomCardProps) => (
		<ReadingRoomCard {...mockReadingRoomCardProps} {...args} />
	);

	beforeEach(() => {
		// Avoid render bloat
		rendered = undefined;
	});

	it('Should show generic information about a room', () => {
		rendered = render(template());

		expect(screen.getByText(mockReadingRoomCardProps.room.name || '')).toBeDefined();
	});

	it('Should render a light card with a short image when not accessible', () => {
		rendered = render(template());

		const card = documentOf(rendered).getElementsByClassName('c-card--mode-light');

		const image = documentOf(rendered).getElementsByClassName(
			styles['c-reading-room-card__background--short']
		);

		expect(card.length).toEqual(1);
		expect(image.length).toEqual(1);
	});

	it('Should show a request access and contact button when not accessible', () => {
		rendered = render(
			template({
				room: mockReadingRoomCardProps.room,
				type: ReadingRoomCardType['no-access'],
			})
		);

		expect(screen.getByText('contact')).toBeDefined();
		expect(screen.getByText('Vraag toegang aan')).toBeDefined();
	});

	it('Should render a dark card with a tall image when accessible', () => {
		rendered = render(
			template({
				room: mockReadingRoomCardProps.room,
				type: ReadingRoomCardType['access-granted'],
				access: AccessGranted,
			})
		);

		const card = documentOf(rendered).getElementsByClassName('c-card--mode-dark');

		const image = documentOf(rendered).getElementsByClassName(
			styles['c-reading-room-card__background--tall']
		);

		expect(card.length).toEqual(1);
		expect(image.length).toEqual(1);
	});

	it('Should show an expiration date and visit button when accessible', () => {
		rendered = render(
			template({
				room: mockReadingRoomCardProps.room,
				type: ReadingRoomCardType['access-granted'],
				access: AccessGranted,
			})
		);

		expect(screen.getByText(/Beschikbaar tot/)).toBeDefined();
		expect(screen.getByText('Bezoek de leeszaal')).toBeDefined();
	});

	it('Should show a dedicated message when access has already been requested', () => {
		rendered = render(
			template({
				room: mockReadingRoomCardProps.room,
				type: ReadingRoomCardType['no-access'],
				access: AccessRequested,
			})
		);

		expect(
			screen.getByText('Momenteel is er geen toegang mogelijk tot deze leeszaal')
		).toBeDefined();
	});
});
