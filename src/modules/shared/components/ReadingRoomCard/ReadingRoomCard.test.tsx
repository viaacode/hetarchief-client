import { render, RenderResult, screen } from '@testing-library/react'; //eslint-disable-line

import ReadingRoomCard from './ReadingRoomCard';
import { ReadingRoomCardType } from './ReadingRoomCard.const';
import styles from './ReadingRoomCard.module.scss';
import { ReadingRoomCardProps } from './ReadingRoomCard.types';
import {
	AccessGranted,
	AccessRequested,
	mockReadingRoomCardProps,
} from './__mocks__/reading-room-card';

describe('Component: <ReadingRoomCard />', () => {
	let rendered: RenderResult | undefined;

	const template = (args?: ReadingRoomCardProps) => {
		return <ReadingRoomCard {...mockReadingRoomCardProps} {...args} />;
	};

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

		const card = rendered.container.getElementsByClassName('c-card--mode-light');

		const image = rendered.container.getElementsByClassName(
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
				type: ReadingRoomCardType['access'],
				access: AccessGranted,
			})
		);

		const card = rendered.container.getElementsByClassName('c-card--mode-dark');

		const image = rendered.container.getElementsByClassName(
			styles['c-reading-room-card__background--tall']
		);

		expect(card.length).toEqual(1);
		expect(image.length).toEqual(1);
	});

	it('Should show an expiration date and visit button when accessible', () => {
		rendered = render(
			template({
				room: mockReadingRoomCardProps.room,
				type: ReadingRoomCardType['access'],
				access: AccessGranted,
			})
		);

		expect(screen.getByText('timer')).toBeDefined(); // Check icon
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
			screen.getByText('not-available') // Check icon
		).toBeDefined();
	});

	it('Should show a timestamp when access is approved and in the future', () => {
		rendered = render(
			template({
				room: mockReadingRoomCardProps.room,
				type: ReadingRoomCardType['future--approved'],
				access: AccessRequested,
			})
		);

		expect(
			screen.getByText('calendar') // Check icon
		).toBeDefined();
	});

	it('Should show a tag with a translated message while future access is still pending', () => {
		rendered = render(
			template({
				room: mockReadingRoomCardProps.room,
				type: ReadingRoomCardType['future--requested'],
				access: AccessRequested,
			})
		);

		const tag = rendered.container.getElementsByClassName('c-tag-list__tag');

		expect(tag.length).toEqual(1);
		expect(tag[0].innerHTML.length).toBeGreaterThan(0);
	});
});
