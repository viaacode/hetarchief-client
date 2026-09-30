import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';

// Echo the key and variables back to assert on which title is picked
vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string, vars?: Record<string, unknown>) =>
		vars ? `${key}:${JSON.stringify(vars)}` : key,
}));
vi.mock('@ie-objects/components/IeObjectCardList/IeObjectCardList', () => ({
	IeObjectCardList: ({ items, type }: { items: unknown[]; type: string }) => (
		<div data-testid="card-list" data-type={type} data-count={items.length} />
	),
}));

import type { MediaObject } from '@ie-objects/components/RelatedObject';
import { ObjectDetailPageRelatedTab } from './ObjectDetailPageRelatedTab';

const item = (id: string): MediaObject => ({
	id,
	title: id,
	subtitle: '',
	description: '',
	type: null,
});

describe('Component: <ObjectDetailPageRelatedTab />', () => {
	it('titles a parent object as the main object', () => {
		render(<ObjectDetailPageRelatedTab items={[item('a')]} isParent />);

		expect(
			screen.getByText(
				'modules/ie-objects/object-detail-page___dit-object-is-onderdeel-van-dit-hoofdobject'
			)
		).toBeInTheDocument();
	});

	it('uses the singular title for one related object', () => {
		render(<ObjectDetailPageRelatedTab items={[item('a')]} isParent={false} />);

		expect(
			screen.getByText(
				'modules/ie-objects/object-detail-page___dit-object-heeft-1-gerelateerd-object'
			)
		).toBeInTheDocument();
	});

	it('passes the amount to the plural title', () => {
		render(<ObjectDetailPageRelatedTab items={[item('a'), item('b')]} isParent={false} />);

		expect(
			screen.getByText(
				'modules/ie-objects/object-detail-page___dit-object-heeft-amount-gerelateerde-objecten:{"amount":2}'
			)
		).toBeInTheDocument();
	});

	it('renders the items as a related card list', () => {
		render(<ObjectDetailPageRelatedTab items={[item('a'), item('b')]} isParent={false} />);

		const list = screen.getByTestId('card-list');
		expect(list).toHaveAttribute('data-type', 'related');
		expect(list).toHaveAttribute('data-count', '2');
	});
});
