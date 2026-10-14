import { act, fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { FileMentionEntityType } from '@ie-objects/ie-objects.types';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string, params?: Record<string, unknown>) =>
		[key.split('___')[1] ?? key, ...Object.values(params ?? {})].join(' '),
}));

import { AiEntityNavigationOverlay } from './AiEntityNavigationOverlay';

const CONTROLS_HIDDEN_CLASS = 'c-video-player-inner--controls-hidden';

let root: HTMLElement;

beforeEach(() => {
	root = document.createElement('div');
	root.classList.add('c-video-player-inner');
	document.body.appendChild(root);
});

afterEach(() => {
	document.body.innerHTML = '';
});

const getOverlay = () =>
	root.querySelector<HTMLElement>('[class*="c-ai-entity-navigation-overlay"]');

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
			playerRoot={root}
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

	it('sits above the player controls, or at the bottom edge while they are hidden', async () => {
		renderOverlay();
		expect(getOverlay()?.className).toContain('--raised');

		await act(async () => {
			root.classList.add(CONTROLS_HIDDEN_CLASS);
		});
		expect(getOverlay()?.className).not.toContain('--raised');

		await act(async () => {
			root.classList.remove(CONTROLS_HIDDEN_CLASS);
		});
		expect(getOverlay()?.className).toContain('--raised');
	});

	it('is rendered inside the player, so hovering it is not leaving the player', () => {
		renderOverlay();

		expect(root).toContainElement(screen.getByText('Jane Eve Doe'));
	});

	it('shows nothing without a player', () => {
		const { container } = render(
			<AiEntityNavigationOverlay
				playerRoot={null}
				entity={entity()}
				intervalIndex={1}
				onSelectInterval={vi.fn()}
				onClose={vi.fn()}
			/>
		);

		expect(container).toBeEmptyDOMElement();
		expect(screen.queryByText('Jane Eve Doe')).not.toBeInTheDocument();
	});

	it('keeps the clicks away from the player, which toggles playback on them, and still works', () => {
		const { onSelectInterval } = renderOverlay();
		const playerClick = vi.fn();
		root.addEventListener('click', playerClick);

		fireEvent.click(screen.getByRole('button', { name: 'volgend-moment' }));

		expect(onSelectInterval).toHaveBeenCalledWith(2);
		expect(playerClick).not.toHaveBeenCalled();
	});

	it('keeps the player awake while the controls show, without waking it from the bar', async () => {
		renderOverlay();
		const playerMove = vi.fn();
		root.addEventListener('mousemove', playerMove);
		const button = screen.getByRole('button', { name: 'volgend-moment' });

		fireEvent.touchStart(button);
		fireEvent.pointerDown(button);
		expect(playerMove).toHaveBeenCalledTimes(1);

		await act(async () => {
			root.classList.add(CONTROLS_HIDDEN_CLASS);
		});
		fireEvent.touchStart(button);
		expect(playerMove).toHaveBeenCalledTimes(1);
	});

	it('keeps the player awake on a key press while the controls show', async () => {
		renderOverlay();
		const playerMove = vi.fn();
		root.addEventListener('mousemove', playerMove);
		const button = screen.getByRole('button', { name: 'volgend-moment' });

		fireEvent.keyDown(button, { key: 'Enter' });
		expect(playerMove).toHaveBeenCalledTimes(1);

		await act(async () => {
			root.classList.add(CONTROLS_HIDDEN_CLASS);
		});
		fireEvent.keyDown(button, { key: 'Enter' });
		expect(playerMove).toHaveBeenCalledTimes(1);
	});

	it('keeps the player awake on a click without touch or key events, as assistive tech sends', () => {
		renderOverlay();
		const playerMove = vi.fn();
		root.addEventListener('mousemove', playerMove);

		fireEvent.click(screen.getByRole('button', { name: 'volgend-moment' }));

		expect(playerMove).toHaveBeenCalledTimes(1);
	});

	it('keeps the keys away from the player, which would take Space and the arrows', () => {
		renderOverlay();
		const playerKey = vi.fn();
		root.addEventListener('keydown', playerKey);
		root.addEventListener('keyup', playerKey);

		const button = screen.getByRole('button', { name: 'volgend-moment' });
		fireEvent.keyDown(button, { key: ' ' });
		fireEvent.keyUp(button, { key: ' ' });

		expect(playerKey).not.toHaveBeenCalled();
	});

	it('shows nothing in the root of a player that was replaced', () => {
		root.remove();

		render(
			<AiEntityNavigationOverlay
				playerRoot={root}
				entity={entity()}
				intervalIndex={1}
				onSelectInterval={vi.fn()}
				onClose={vi.fn()}
			/>
		);

		expect(root.childElementCount).toBe(0);
	});

	it('removes itself from the player when it unmounts', () => {
		const { unmount } = render(
			<AiEntityNavigationOverlay
				playerRoot={root}
				entity={entity()}
				intervalIndex={1}
				onSelectInterval={vi.fn()}
				onClose={vi.fn()}
			/>
		);
		expect(root.childElementCount).toBe(1);

		unmount();

		expect(root.childElementCount).toBe(0);
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
				playerRoot={root}
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

	it('shows the initials for a person without still', () => {
		renderOverlay();

		expect(screen.getByText('JD')).toBeInTheDocument();
	});

	it('shows the first letter of a place or organisation in a coloured circle', () => {
		const { unmount } = render(
			<AiEntityNavigationOverlay
				playerRoot={root}
				entity={entity({ type: FileMentionEntityType.PLACE, name: 'Antwerpen' })}
				intervalIndex={0}
				onSelectInterval={vi.fn()}
				onClose={vi.fn()}
			/>
		);
		expect(screen.getByText('A')).toHaveAttribute(
			'style',
			expect.stringContaining('background-color')
		);
		expect(screen.queryByText('AN')).not.toBeInTheDocument();
		expect(screen.getByText('Antwerpen')).toBeInTheDocument();
		unmount();

		renderOverlay({
			entity: entity({ type: FileMentionEntityType.ORGANIZATION, name: 'Sint Lucas Gent' }),
		});
		expect(screen.getByText('S')).toBeInTheDocument();
		expect(screen.queryByText('SG')).not.toBeInTheDocument();
	});

	it('does not use the still of a place or organisation', () => {
		render(
			<AiEntityNavigationOverlay
				playerRoot={root}
				entity={entity({ type: FileMentionEntityType.PLACE, name: 'Antwerpen', still: 'x.jpg' })}
				intervalIndex={0}
				onSelectInterval={vi.fn()}
				onClose={vi.fn()}
			/>
		);

		expect(root.querySelector('img')).not.toBeInTheDocument();
	});
});
