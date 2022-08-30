import { act, render, RenderResult } from '@testing-library/react';

import { VisitorSpaceCardProps } from '../VisitorSpaceCard/VisitorSpaceCard.types';

import VisitorSpaceCardList from './VisitorSpaceCardList';
import { sixItems } from './__mocks__/visitor-space-card-list';

describe('Component: <MediaCardList />', () => {
	const data: VisitorSpaceCardProps[] = sixItems;
	const containerClass = '.c-visitor-space-card-list';

	let rendered: RenderResult | undefined;

	beforeEach(() => {
		rendered = undefined;
	});

	it('Should only show the wrapping element when no data is provided', async () => {
		await act(async () => {
			rendered = render(<VisitorSpaceCardList items={[]} />);
			return Promise.resolve();
		});

		const container = rendered?.container.querySelector(containerClass);

		expect(container).toBeDefined();
		expect(container?.children.length).toEqual(0);
	});

	it('Should show multiple children in the wrapping element if data is provided', async () => {
		await act(async () => {
			rendered = render(<VisitorSpaceCardList items={data} />);
		});

		const container = rendered?.container.querySelector(containerClass);

		expect(container).toBeDefined();
		expect(container?.children.length).toBeGreaterThan(0);
	});

	it('Should show at most 3 children if the resolution is below 768px', async () => {
		window.innerWidth = 576;

		await act(async () => {
			rendered = render(<VisitorSpaceCardList items={data} />);
		});

		const container = rendered?.container.querySelector(containerClass);

		expect(container).toBeDefined();
		expect(container?.children.length).toBeLessThanOrEqual(3);
	});

	it('Should show at most 6 children if the resolution is above 768px', async () => {
		window.innerWidth = 768;

		await act(async () => {
			rendered = render(<VisitorSpaceCardList items={[...data, ...data]} />);
		});

		const container = rendered?.container.querySelector(containerClass);

		expect(container).toBeDefined();
		expect(container?.children.length).toBeLessThanOrEqual(6);
	});

	it('Should show all items if the limiter is off', async () => {
		const many = [...data, ...data];

		await act(async () => {
			rendered = render(<VisitorSpaceCardList items={many} limit={false} />);
		});

		const container = rendered?.container.querySelector(containerClass);

		expect(container).toBeDefined();
		expect(container?.children.length).toEqual(many.length);
	});
});
