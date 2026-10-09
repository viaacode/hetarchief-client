import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let mockWindowWidth = 1400;

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key.split('___')[1] ?? key,
}));
vi.mock('@shared/hooks/use-window-size-context', () => ({
	useWindowSizeContext: () => ({ width: mockWindowWidth, height: 800 }),
}));
vi.mock('@shared/components/HighlightedMetadata/HighlightedMetadata', () => ({
	default: ({ data }: { data: string }) => <span>{data}</span>,
}));

import MetaDataFieldWithHighlightingAndMaxLength from './MetaDataFieldWithHighlightingAndMaxLength';

const renderField = (data: string) =>
	render(
		<MetaDataFieldWithHighlightingAndMaxLength
			title="Beschrijving"
			data={data}
			maxLength={10}
			onReadMoreClicked={vi.fn()}
		/>
	);

describe('Component: <MetaDataFieldWithHighlightingAndMaxLength />', () => {
	beforeEach(() => {
		mockWindowWidth = 1400;
	});

	it('shows the read more label on desktop', () => {
		renderField('Een heel lange beschrijving');

		expect(screen.getByRole('button', { name: 'lees-meer' })).toBeInTheDocument();
	});

	it('shows the separate read more label on mobile', () => {
		mockWindowWidth = 375;
		renderField('Een heel lange beschrijving');

		expect(screen.getByRole('button', { name: 'lees-meer-mobiel' })).toBeInTheDocument();
	});

	it('shows the separate read more label on tablet portrait, where the mobile layout applies', () => {
		mockWindowWidth = 800;
		renderField('Een heel lange beschrijving');

		expect(screen.getByRole('button', { name: 'lees-meer-mobiel' })).toBeInTheDocument();
	});

	it('shows no read more button when the text fits', () => {
		mockWindowWidth = 375;
		renderField('Kort');

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});
});
