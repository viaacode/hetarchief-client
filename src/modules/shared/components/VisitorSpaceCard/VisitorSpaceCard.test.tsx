import { render, screen } from '@testing-library/react'; //eslint-disable-line

import VisitorSpaceCard from './VisitorSpaceCard';
import { VisitorSpaceCardType } from './VisitorSpaceCard.const';
import { VisitorSpaceCardProps } from './VisitorSpaceCard.types';
import {
	AccessGranted,
	AccessRequested,
	mockVisitorSpaceCardProps,
} from './__mocks__/visitor-space-card';

describe('Component: <VisitorSpaceCard />', () => {
	const template = (args?: VisitorSpaceCardProps) => (
		<VisitorSpaceCard {...mockVisitorSpaceCardProps} {...args} />
	);

	it('Should show generic information about a room', () => {
		render(template());

		expect(screen.getByText(mockVisitorSpaceCardProps.room.name || '')).toBeDefined();
	});

	it('Should render a light card with a short image when not accessible', () => {
		const { container } = render(template());

		const card = container.getElementsByClassName('c-card--mode-light');
		const image = container.getElementsByClassName('c-card-image__background--short');

		expect(card.length).toEqual(1);
		expect(image.length).toEqual(1);
	});

	it('Should show a request access and contact button when not accessible', () => {
		render(
			template({
				room: mockVisitorSpaceCardProps.room,
				type: VisitorSpaceCardType.noAccess,
			})
		);

		expect(screen.getByText('contact')).toBeDefined();
		expect(screen.getByText(/toegang/i)).toBeDefined();
	});

	it('Should render a dark card with a tall image when accessible', () => {
		const { container } = render(
			template({
				room: mockVisitorSpaceCardProps.room,
				type: VisitorSpaceCardType.access,
				access: AccessGranted,
			})
		);

		const card = container.getElementsByClassName('c-card--mode-dark');

		const image = container.getElementsByClassName('c-card-image__background--tall');

		expect(card.length).toEqual(1);
		expect(image.length).toEqual(1);
	});

	it('Should show an expiration date and visit button when accessible', () => {
		render(
			template({
				room: mockVisitorSpaceCardProps.room,
				type: VisitorSpaceCardType.access,
				access: AccessGranted,
			})
		);

		expect(screen.getByText('timer')).toBeDefined(); // Check icon
		expect(screen.getByText(/bezoek/i)).toBeDefined();
	});

	it('Should show a dedicated message when access has already been requested', () => {
		render(
			template({
				room: mockVisitorSpaceCardProps.room,
				type: VisitorSpaceCardType.noAccess,
				access: AccessRequested,
			})
		);

		expect(
			screen.getByText('not-available') // Check icon
		).toBeDefined();
	});

	it('Should show a timestamp when access is approved and in the future', () => {
		render(
			template({
				room: mockVisitorSpaceCardProps.room,
				type: VisitorSpaceCardType.futureApproved,
				access: AccessRequested,
			})
		);

		expect(
			screen.getByText('calendar') // Check icon
		).toBeDefined();
	});

	it('Should show a tag with a translated message while future access is still pending', () => {
		const { container } = render(
			template({
				room: mockVisitorSpaceCardProps.room,
				type: VisitorSpaceCardType.futureRequested,
				access: AccessRequested,
			})
		);

		const tag = container.getElementsByClassName('c-tag-list__tag');

		expect(tag.length).toEqual(1);
		expect(tag[0].innerHTML.length).toBeGreaterThan(0);
	});
});
