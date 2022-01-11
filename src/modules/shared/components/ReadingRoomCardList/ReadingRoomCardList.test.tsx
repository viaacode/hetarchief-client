import { render, RenderResult } from '@testing-library/react';

import { ReadingRoomCardProps } from '../ReadingRoomCard/ReadingRoomCard.types';

import ReadingRoomCardList from './ReadingRoomCardList';
import styles from './ReadingRoomCardList.module.scss';
import { sixItems } from './__mocks__/reading-room-card-list';

describe('Component: <MediaCardList />', () => {
	const data: ReadingRoomCardProps[] = sixItems;
	const containerClass = `.${styles['c-reading-room-card-list']}`;

	let rendered: RenderResult | undefined;

	beforeEach(() => {
		rendered = undefined;
	});

	it('Should only show the wrapping element when no data is provided', () => {
		rendered = render(<ReadingRoomCardList items={[]} />);
		const container = rendered.container.querySelector(containerClass);

		expect(container).toBeDefined();
		expect(container?.children.length).toEqual(0);
	});

	it('Should show multiple children in the wrapping element if data is provided', () => {
		rendered = render(<ReadingRoomCardList items={data} />);
		const container = rendered.container.querySelector(containerClass);

		expect(container).toBeDefined();
		expect(container?.children.length).toBeGreaterThan(0);
	});

	it('Should show at most 3 children if the resolution is below 768px', () => {
		window.innerWidth = 576;

		rendered = render(<ReadingRoomCardList items={data} />);
		const container = rendered.container.querySelector(containerClass);

		expect(container).toBeDefined();
		expect(container?.children.length).toBeLessThanOrEqual(3);
	});

	it('Should show at most 6 children if the resolution is above 768px', () => {
		window.innerWidth = 768;

		rendered = render(<ReadingRoomCardList items={[...data, ...data]} />);
		const container = rendered.container.querySelector(containerClass);

		expect(container).toBeDefined();
		expect(container?.children.length).toBeLessThanOrEqual(6);
	});

	it('Should show all items if the limiter is off', () => {
		const many = [...data, ...data];

		rendered = render(<ReadingRoomCardList items={many} limit={false} />);
		const container = rendered.container.querySelector(containerClass);

		expect(container).toBeDefined();
		expect(container?.children.length).toEqual(many.length);
	});
});
