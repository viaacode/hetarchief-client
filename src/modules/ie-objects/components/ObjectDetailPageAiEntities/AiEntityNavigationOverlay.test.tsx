import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { FileMentionEntityType } from '@ie-objects/ie-objects.types';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string, params?: Record<string, unknown>) =>
		[key.split('___')[1] ?? key, ...Object.values(params ?? {})].join(' '),
}));

import { AiEntityNavigationOverlay } from './AiEntityNavigationOverlay';

const entity = (overrides: Partial<AiEntity> = {}): AiEntity => ({
	id: 'a',
	type: FileMentionEntityType.PERSON,
	name: 'Jane Eve Doe',
	wikidataId: null,
	wikidataUrl: null,
	still: null,
	intervals: [
		{ start: 10, end: 20 },
		{ start: 30, end: 30 },
		{ start: 50, end: 60 },
	],
	...overrides,
});

const renderOverlay = (
	props: Partial<React.ComponentProps<typeof AiEntityNavigationOverlay>> = {}
) => {
	const onSelectInterval = vi.fn();
	const onClose = vi.fn();
	render(
		<AiEntityNavigationOverlay
			entity={entity()}
			intervalIndex={1}
			onSelectInterval={onSelectInterval}
			onClose={onClose}
			{...props}
		/>
	);
	return { onSelectInterval, onClose };
};

describe('Component: <AiEntityNavigationOverlay />', () => {
	it('shows the name and the position among the intervals of the entity', () => {
		renderOverlay();

		expect(screen.getByText('Jane Eve Doe')).toBeInTheDocument();
		expect(screen.getByText('index-van-total 2 3')).toBeInTheDocument();
	});

	it('sits above the player controls, or at the bottom edge without them', () => {
		const { container, rerender } = render(
			<AiEntityNavigationOverlay
				entity={entity()}
				intervalIndex={1}
				onSelectInterval={vi.fn()}
				onClose={vi.fn()}
			/>
		);
		const overlay = container.firstElementChild;
		expect(overlay?.className).toContain('--raised');

		rerender(
			<AiEntityNavigationOverlay
				entity={entity()}
				intervalIndex={1}
				onSelectInterval={vi.fn()}
				onClose={vi.fn()}
				isRaised={false}
			/>
		);
		expect(overlay?.className).not.toContain('--raised');
	});

	it('goes to the previous and the next interval', () => {
		const { onSelectInterval } = renderOverlay();

		fireEvent.click(screen.getByRole('button', { name: 'vorig-moment' }));
		fireEvent.click(screen.getByRole('button', { name: 'volgend-moment' }));

		expect(onSelectInterval).toHaveBeenNthCalledWith(1, 0);
		expect(onSelectInterval).toHaveBeenNthCalledWith(2, 2);
	});

	it('cannot go before the first or after the last interval', () => {
		const { unmount } = render(
			<AiEntityNavigationOverlay
				entity={entity()}
				intervalIndex={0}
				onSelectInterval={vi.fn()}
				onClose={vi.fn()}
			/>
		);
		expect(screen.getByRole('button', { name: 'vorig-moment' })).toBeDisabled();
		expect(screen.getByRole('button', { name: 'volgend-moment' })).toBeEnabled();
		unmount();

		renderOverlay({ intervalIndex: 2 });
		expect(screen.getByRole('button', { name: 'volgend-moment' })).toBeDisabled();
	});

	it('closes', () => {
		const { onClose } = renderOverlay();

		fireEvent.click(screen.getByRole('button', { name: 'sluiten' }));

		expect(onClose).toHaveBeenCalled();
	});

	it('shows initials for a person without still, and nothing for a place', () => {
		const { unmount } = render(
			<AiEntityNavigationOverlay
				entity={entity()}
				intervalIndex={0}
				onSelectInterval={vi.fn()}
				onClose={vi.fn()}
			/>
		);
		expect(screen.getByText('JD')).toBeInTheDocument();
		unmount();

		renderOverlay({ entity: entity({ type: FileMentionEntityType.PLACE, name: 'Antwerpen' }) });
		expect(screen.queryByText('AN')).not.toBeInTheDocument();
	});
});
