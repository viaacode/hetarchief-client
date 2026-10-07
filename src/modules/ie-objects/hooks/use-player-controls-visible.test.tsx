import { act, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { usePlayerControlsVisible } from '@ie-objects/hooks/use-player-controls-visible';
import { afterEach, describe, expect, it } from 'vitest';

const Probe = ({ isEnabled = true }: { isEnabled?: boolean }) => (
	<span data-testid="visible">{String(usePlayerControlsVisible(isEnabled))}</span>
);

describe('Hook: usePlayerControlsVisible', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	const addPlayer = (isHidden: boolean) => {
		const player = document.createElement('div');
		player.className = 'p-object-detail__flowplayer c-video-player';
		const inner = document.createElement('div');
		inner.className = `c-video-player-inner${isHidden ? ' c-video-player-inner--controls-hidden' : ''}`;
		player.appendChild(inner);
		document.body.appendChild(player);
		return inner;
	};

	it('is visible without a player', () => {
		render(<Probe />);

		expect(screen.getByTestId('visible')).toHaveTextContent('true');
	});

	it('is hidden while the control bar marks its container as hidden', () => {
		addPlayer(true);
		render(<Probe />);

		expect(screen.getByTestId('visible')).toHaveTextContent('false');
	});

	it('follows the controls as they appear and disappear', async () => {
		const inner = addPlayer(true);
		render(<Probe />);

		await act(async () => {
			inner.classList.remove('c-video-player-inner--controls-hidden');
		});
		expect(screen.getByTestId('visible')).toHaveTextContent('true');

		await act(async () => {
			inner.classList.add('c-video-player-inner--controls-hidden');
		});
		expect(screen.getByTestId('visible')).toHaveTextContent('false');
	});

	it('picks up a player that renders after the hook', async () => {
		render(<Probe />);

		await act(async () => {
			addPlayer(true);
		});
		expect(screen.getByTestId('visible')).toHaveTextContent('false');
	});

	it('ignores the player while disabled', () => {
		addPlayer(true);
		render(<Probe isEnabled={false} />);

		expect(screen.getByTestId('visible')).toHaveTextContent('true');
	});
});
