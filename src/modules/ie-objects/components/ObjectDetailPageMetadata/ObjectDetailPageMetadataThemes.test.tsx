import { render, screen, within } from '@testing-library/react';

import '@testing-library/jest-dom';
import { Locale } from '@shared/utils/i18n';
import type { HetArchiefIeObjectTheme } from '@viaa/avo2-types';
import { describe, expect, it } from 'vitest';

import { ObjectDetailPageMetadataThemes } from './ObjectDetailPageMetadataThemes';

const pukkelpop: HetArchiefIeObjectTheme = {
	id: '7c4f8d1a-9b2e-4c3d-8a1f-2e5b6c7d8e9f',
	slug: 'pukkelpop',
	nameNl: 'Pukkelpop',
	nameEn: 'Pukkelpop festival',
	contentPagePathNl: '/themas/pukkelpop',
	contentPagePathEn: '/themes/pukkelpop',
	ieObjectCount: 150,
};

const memorial: HetArchiefIeObjectTheme = {
	id: '3a1b2c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
	slug: 'memorial-van-damme',
	nameNl: 'Memorial Van Damme',
	nameEn: 'Memorial Van Damme',
	contentPagePathNl: null,
	contentPagePathEn: null,
	ieObjectCount: 42,
};

describe('Component: <ObjectDetailPageMetadataThemes />', () => {
	it('links the theme name to the Dutch theme detail page', () => {
		render(
			<ObjectDetailPageMetadataThemes title="Thema's" themes={[pukkelpop]} locale={Locale.nl} />
		);

		expect(screen.getByText("Thema's")).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Pukkelpop' })).toHaveAttribute(
			'href',
			'/themas/pukkelpop'
		);
	});

	it('uses the English name and path when the UI language is English', () => {
		render(
			<ObjectDetailPageMetadataThemes title="Themes" themes={[pukkelpop]} locale={Locale.en} />
		);

		expect(screen.getByRole('link', { name: 'Pukkelpop festival' })).toHaveAttribute(
			'href',
			'/themes/pukkelpop'
		);
	});

	it('renders the name as plain text when the theme has no detail page', () => {
		const { container } = render(
			<ObjectDetailPageMetadataThemes title="Thema's" themes={[memorial]} locale={Locale.nl} />
		);

		expect(screen.getByText('Memorial Van Damme')).toBeInTheDocument();
		expect(container.querySelector('a')).not.toBeInTheDocument();
	});

	it('shows the linked object count per theme, keeping the given order', () => {
		render(
			<ObjectDetailPageMetadataThemes
				title="Thema's"
				themes={[pukkelpop, memorial]}
				locale={Locale.nl}
			/>
		);

		const items = screen.getAllByRole('listitem');
		expect(items).toHaveLength(2);
		expect(within(items[0]).getByText('150')).toBeInTheDocument();
		expect(within(items[1]).getByText('42')).toBeInTheDocument();
	});
});
