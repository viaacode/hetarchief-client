import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';

// Translations resolve to empty strings in tests, so echo the key back to assert on labels
vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key,
	tHtml: (key: string) => key,
}));

// The synopsis renders through HighlightSearchTerms, which reads the highlight terms off the URL
vi.mock('use-query-params', () => ({
	StringParam: {},
	withDefault: (param: unknown, defaultValue: unknown) => ({ param, defaultValue }),
	useQueryParam: () => ['', vi.fn()],
}));

import { ObjectDetailPageMetadataAiDescription } from './ObjectDetailPageMetadataAiDescription';

const SHORT_SYNOPSIS = 'Een korte samenvatting van de opname.';
const LONG_SYNOPSIS = 'a'.repeat(300);

describe('Component: <ObjectDetailPageMetadataAiDescription />', () => {
	it('shows the AI title and synopsis', () => {
		render(
			<ObjectDetailPageMetadataAiDescription
				name="Nabeschouwing van een derbyzege"
				synopsis={SHORT_SYNOPSIS}
				onReadMoreClicked={vi.fn()}
			/>
		);

		expect(
			screen.getByRole('heading', { name: 'Nabeschouwing van een derbyzege' })
		).toBeInTheDocument();
		expect(screen.getByText(SHORT_SYNOPSIS)).toBeInTheDocument();
	});

	it('truncates a synopsis longer than the AI field limit', () => {
		render(
			<ObjectDetailPageMetadataAiDescription
				name="Titel"
				synopsis={LONG_SYNOPSIS}
				onReadMoreClicked={vi.fn()}
			/>
		);

		expect(screen.getByText(`${'a'.repeat(250)}...`)).toBeInTheDocument();
	});

	it('renders the disclaimer as a labelled button', () => {
		render(
			<ObjectDetailPageMetadataAiDescription
				name="Titel"
				synopsis={SHORT_SYNOPSIS}
				onReadMoreClicked={vi.fn()}
			/>
		);

		expect(
			screen.getByRole('button', {
				name: 'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___meer-info-over-ai-gegenereerde-titel-en-samenvatting',
			})
		).toBeInTheDocument();
	});
});
