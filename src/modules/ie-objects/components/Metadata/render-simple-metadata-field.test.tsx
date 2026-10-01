import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';

// The string variant goes through HighlightSearchTerms, which reads the search terms off the URL
vi.mock(
	'@shared/components/MetaDataFieldWithHighlightingAndMaxLength/MetaDataFieldWithHighlightingAndMaxLength',
	() => ({
		default: ({ data }: { data: string }) => <span data-testid="string-field">{data}</span>,
	})
);

import MetadataList from './MetadataList';
import { renderSimpleMetadataField } from './render-simple-metadata-field';

const renderInList = (data: Parameters<typeof renderSimpleMetadataField>[1]) =>
	render(
		<MetadataList allowTwoColumns={false}>
			{renderSimpleMetadataField('Titel', data, vi.fn())}
		</MetadataList>
	);

describe('renderSimpleMetadataField', () => {
	it.each([
		['null', null],
		['undefined', undefined],
		['an empty string', ''],
	])('renders nothing for %s', (_label, data) => {
		renderInList(data);

		expect(screen.queryByText('Titel')).not.toBeInTheDocument();
	});

	it('renders a string through the max-length field', () => {
		renderInList('Een waarde');

		expect(screen.getByText('Titel')).toBeInTheDocument();
		expect(screen.getByTestId('string-field')).toHaveTextContent('Een waarde');
	});

	it('renders a node as is', () => {
		renderInList(<a href="/x">een link</a>);

		expect(screen.getByText('Titel')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'een link' })).toBeInTheDocument();
		expect(screen.queryByTestId('string-field')).not.toBeInTheDocument();
	});
});
