import { act, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { CONTROLS_HIDDEN_CLASS, usePlayerControlsVisible } from './use-player-controls-visible';

const Probe = ({ playerRoot }: { playerRoot: HTMLElement | null }) => (
	<span data-testid="visible">{String(usePlayerControlsVisible(playerRoot))}</span>
);

const createRoot = (isHidden: boolean) => {
	const root = document.createElement('div');
	root.classList.toggle(CONTROLS_HIDDEN_CLASS, isHidden);
	document.body.appendChild(root);
	return root;
};

describe('Hook: usePlayerControlsVisible', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('is not visible without a player', () => {
		render(<Probe playerRoot={null} />);

		expect(screen.getByTestId('visible')).toHaveTextContent('false');
	});

	it('reads the controls of the player right away', () => {
		render(<Probe playerRoot={createRoot(false)} />);

		expect(screen.getByTestId('visible')).toHaveTextContent('true');
	});

	it('is visible in the very first render, not only after the effect', () => {
		const renders: boolean[] = [];
		const root = createRoot(false);
		const Recorder = () => {
			const areControlsVisible = usePlayerControlsVisible(root);
			renders.push(areControlsVisible);
			return null;
		};

		render(<Recorder />);

		expect(renders[0]).toBe(true);
	});

	it('follows the controls as they hide and show', async () => {
		const root = createRoot(true);
		render(<Probe playerRoot={root} />);
		expect(screen.getByTestId('visible')).toHaveTextContent('false');

		await act(async () => {
			root.classList.remove(CONTROLS_HIDDEN_CLASS);
		});
		expect(screen.getByTestId('visible')).toHaveTextContent('true');

		await act(async () => {
			root.classList.add(CONTROLS_HIDDEN_CLASS);
		});
		expect(screen.getByTestId('visible')).toHaveTextContent('false');
	});

	it('is not visible any more once the player is gone', () => {
		const { rerender } = render(<Probe playerRoot={createRoot(false)} />);

		rerender(<Probe playerRoot={null} />);

		expect(screen.getByTestId('visible')).toHaveTextContent('false');
	});

	it('stops following a player that was replaced', async () => {
		const oldRoot = createRoot(false);
		const { rerender } = render(<Probe playerRoot={oldRoot} />);

		rerender(<Probe playerRoot={createRoot(false)} />);
		await act(async () => {
			oldRoot.classList.add(CONTROLS_HIDDEN_CLASS);
		});

		expect(screen.getByTestId('visible')).toHaveTextContent('true');
	});
});
