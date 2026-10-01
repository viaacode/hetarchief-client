import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/router', () => ({
	useRouter: () => ({ query: { slug: 'vrt' } }),
}));
vi.mock('@shared/hooks/use-locale/use-locale', () => ({ useLocale: () => 'nl' }));
vi.mock('@ie-objects/components/RelatedObject', () => ({
	RelatedObject: ({ object }: { object: { title: string; subtitle: string } }) => (
		<div>
			<span>{object.title}</span>
			<span>{object.subtitle}</span>
		</div>
	),
}));

import type { MediaObject } from '@ie-objects/components/RelatedObject';
import { IeObjectCardList } from './IeObjectCardList';

const items: MediaObject[] = [
	{ id: 'abc', title: 'Eerste', subtitle: 'VRT (2020)', description: '', type: null },
	{ id: 'def', title: 'Tweede', subtitle: 'VRT (2021)', description: '', type: null },
];

describe('Component: <IeObjectCardList />', () => {
	it('renders nothing without items', () => {
		const { container } = render(<IeObjectCardList type="related" items={[]} />);

		expect(container).toBeEmptyDOMElement();
	});

	it('links every item to its detail page under the current maintainer slug', () => {
		render(<IeObjectCardList type="similar" items={items} />);

		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(2);
		expect(links[0].getAttribute('href')).toMatch(/\/vrt\/abc$/);
		expect(links[1].getAttribute('href')).toMatch(/\/vrt\/def$/);
	});

	it('names each link after the full card content instead of only the title', () => {
		render(<IeObjectCardList type="related" items={items} />);

		const link = screen.getByRole('link', { name: /Eerste/ });
		expect(link).not.toHaveAttribute('aria-label');
		expect(link).toHaveAccessibleName(/VRT \(2020\)/);
	});

	it('applies the type modifier and custom class name', () => {
		const { container } = render(
			<IeObjectCardList type="similar" items={items} className="custom" />
		);

		const list = container.querySelector('ul');
		expect(list).toHaveClass('custom');
		expect(list).toHaveClass('c-ie-object-card-list--similar');
	});
});
