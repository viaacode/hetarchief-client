import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SubtitlesTeaser } from './SubtitlesTeaser';
import {
	CONTROLS_HIDDEN_CLASS,
	SUBTITLES_TEASER_COOKIE,
	SUBTITLES_TEASER_DURATION_MS,
} from './SubtitlesTeaser.const';

vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key.split('___')[1] ?? key,
}));

const TEASER_NAME = 'probeer-onze-nieuwe-ai-gegenereerde-ondertiteling';

class ResizeObserverStub {
	observe = vi.fn();
	disconnect = vi.fn();
	unobserve = vi.fn();
}

const setPreferencesConsent = (preferences: boolean | undefined) => {
	(window as unknown as { Cookiebot?: unknown }).Cookiebot =
		preferences === undefined ? undefined : { consent: { preferences } };
};

const writeRawCookie = (cookie: string) => {
	// biome-ignore lint/suspicious/noDocumentCookie: the component writes the same way, the test sets up state
	document.cookie = cookie;
};

const hasDismissCookie = () =>
	document.cookie.split('; ').includes(`${SUBTITLES_TEASER_COOKIE}=true`);

const createPlayerRoot = ({
	withSubtitlesButton = true,
	controlsHidden = true,
}: {
	withSubtitlesButton?: boolean;
	controlsHidden?: boolean;
} = {}) => {
	const root = document.createElement('div');
	root.classList.add('c-video-player-inner');
	if (controlsHidden) {
		root.classList.add(CONTROLS_HIDDEN_CLASS);
	}
	const video = document.createElement('video');
	root.appendChild(video);
	let subtitlesButton: HTMLButtonElement | null = null;
	if (withSubtitlesButton) {
		subtitlesButton = document.createElement('button');
		subtitlesButton.setAttribute('aria-controls', 'player-1__subtitles');
		root.appendChild(subtitlesButton);
	}
	document.body.appendChild(root);
	return { root, video, subtitlesButton };
};

const renderTeaser = (root: HTMLElement) => render(<SubtitlesTeaser playerRoot={root} />);

const getTeaser = () => screen.queryByRole('button', { name: new RegExp(TEASER_NAME) });

describe('SubtitlesTeaser', () => {
	beforeEach(() => {
		vi.stubGlobal('ResizeObserver', ResizeObserverStub);
		setPreferencesConsent(true);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.useRealTimers();
		setPreferencesConsent(undefined);
		writeRawCookie(`${SUBTITLES_TEASER_COOKIE}=; max-age=0; path=/`);
		document.body.innerHTML = '';
	});

	describe('when it shows', () => {
		it('does not show before the controls show or the video plays', async () => {
			const { root } = createPlayerRoot({ controlsHidden: true });

			renderTeaser(root);
			await act(async () => {});

			expect(getTeaser()).not.toBeInTheDocument();
		});

		it('shows the first time the controls show', async () => {
			const { root } = createPlayerRoot({ controlsHidden: true });
			renderTeaser(root);

			await act(async () => {
				root.classList.remove(CONTROLS_HIDDEN_CLASS);
			});

			await waitFor(() => expect(getTeaser()).toBeInTheDocument());
		});

		it('shows when the player is rendered with the controls already showing', async () => {
			const { root } = createPlayerRoot({ controlsHidden: false });

			renderTeaser(root);

			await waitFor(() => expect(getTeaser()).toBeInTheDocument());
		});

		it('shows on the first play, also while the controls stay hidden', async () => {
			const { root, video } = createPlayerRoot({ controlsHidden: true });
			renderTeaser(root);

			await act(async () => {
				video.dispatchEvent(new Event('play'));
			});

			await waitFor(() => expect(getTeaser()).toBeInTheDocument());
		});

		it('does not show when the player has no subtitles button', async () => {
			const { root } = createPlayerRoot({ withSubtitlesButton: false, controlsHidden: false });

			renderTeaser(root);
			await act(async () => {});

			expect(getTeaser()).not.toBeInTheDocument();
		});

		it('does not show for a visitor who dismissed it before', async () => {
			writeRawCookie(`${SUBTITLES_TEASER_COOKIE}=true; path=/`);
			const { root } = createPlayerRoot({ controlsHidden: false });

			renderTeaser(root);
			await act(async () => {});

			expect(getTeaser()).not.toBeInTheDocument();
		});

		it('does not show for a player that is no longer in the page', async () => {
			const { root } = createPlayerRoot({ controlsHidden: false });
			root.remove();

			renderTeaser(root);
			await act(async () => {});

			expect(getTeaser()).not.toBeInTheDocument();
		});

		it('disappears after the set duration, counted from when it showed', async () => {
			vi.useFakeTimers();
			const { root } = createPlayerRoot({ controlsHidden: false });
			renderTeaser(root);
			await act(async () => {});
			expect(getTeaser()).toBeInTheDocument();

			await act(async () => {
				vi.advanceTimersByTime(SUBTITLES_TEASER_DURATION_MS - 1);
			});
			expect(getTeaser()).toBeInTheDocument();

			await act(async () => {
				vi.advanceTimersByTime(1);
			});
			expect(getTeaser()).not.toBeInTheDocument();
			// Expiring is not dismissing: it comes back on the next visit
			expect(hasDismissCookie()).toBe(false);
		});
	});

	describe('time to read', () => {
		const showTeaser = async () => {
			const { root } = createPlayerRoot({ controlsHidden: false });
			renderTeaser(root);
			await act(async () => {});
			expect(getTeaser()).toBeInTheDocument();
		};

		it.each([
			['hovered', 'pointerEnter', 'pointerLeave'],
			['focused', 'focus', 'blur'],
		])('does not expire while it is %s', async (_label, enter, leave) => {
			vi.useFakeTimers();
			await showTeaser();
			const teaser = getTeaser() as HTMLElement;

			await act(async () => {
				fireEvent[enter as 'focus'](teaser);
			});
			await act(async () => {
				vi.advanceTimersByTime(SUBTITLES_TEASER_DURATION_MS * 3);
			});
			expect(getTeaser()).toBeInTheDocument();

			// The countdown starts over once it is let go
			await act(async () => {
				fireEvent[leave as 'blur'](teaser);
			});
			await act(async () => {
				vi.advanceTimersByTime(SUBTITLES_TEASER_DURATION_MS - 1);
			});
			expect(getTeaser()).toBeInTheDocument();

			await act(async () => {
				vi.advanceTimersByTime(1);
			});
			expect(getTeaser()).not.toBeInTheDocument();
		});
	});

	describe('position', () => {
		it('sits above the subtitles button while the controls show', async () => {
			const { root } = createPlayerRoot({ controlsHidden: false });

			renderTeaser(root);

			await waitFor(() => expect(getTeaser()?.className).toContain('above-button'));
		});

		it('drops to the bottom edge while the controls are hidden, and moves back up', async () => {
			const { root, video } = createPlayerRoot({ controlsHidden: true });
			renderTeaser(root);
			await act(async () => {
				video.dispatchEvent(new Event('play'));
			});
			await waitFor(() => expect(getTeaser()).toBeInTheDocument());
			expect(getTeaser()?.className).not.toContain('above-button');

			await act(async () => {
				root.classList.remove(CONTROLS_HIDDEN_CLASS);
			});

			await waitFor(() => expect(getTeaser()?.className).toContain('above-button'));
		});

		it('passes what it measured to the stylesheet', async () => {
			const { root, subtitlesButton } = createPlayerRoot({ controlsHidden: false });
			vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({
				left: 100,
				right: 600,
				top: 0,
				bottom: 400,
				width: 500,
				height: 400,
				x: 100,
				y: 0,
				toJSON: () => ({}),
			});
			vi.spyOn(subtitlesButton as HTMLElement, 'getBoundingClientRect').mockReturnValue({
				left: 500,
				right: 540,
				top: 350,
				bottom: 390,
				width: 40,
				height: 40,
				x: 500,
				y: 350,
				toJSON: () => ({}),
			});

			renderTeaser(root);

			await waitFor(() => expect(getTeaser()).toBeInTheDocument());
			const style = (getTeaser() as HTMLElement).style;
			// Button middle from the player's left edge, and player bottom to button top
			expect(style.getPropertyValue('--subtitles-teaser-anchor-x')).toBe('420px');
			expect(style.getPropertyValue('--subtitles-teaser-player-width')).toBe('500px');
			expect(style.getPropertyValue('--subtitles-teaser-button-offset')).toBe('50px');
		});
	});

	describe('dismissing', () => {
		it('hides it for good and keeps the click away from the player', async () => {
			const { root } = createPlayerRoot({ controlsHidden: false });
			const playerClick = vi.fn();
			root.addEventListener('click', playerClick);
			renderTeaser(root);
			await waitFor(() => expect(getTeaser()).toBeInTheDocument());

			await act(async () => {
				(getTeaser() as HTMLElement).click();
			});

			expect(getTeaser()).not.toBeInTheDocument();
			// The player toggles playback on a click, the teaser must not
			expect(playerClick).not.toHaveBeenCalled();
		});

		it('hides it when the subtitles button is clicked, and still lets the button work', async () => {
			const { root, subtitlesButton } = createPlayerRoot({ controlsHidden: false });
			const buttonClick = vi.fn();
			(subtitlesButton as HTMLElement).addEventListener('click', buttonClick);
			renderTeaser(root);
			await waitFor(() => expect(getTeaser()).toBeInTheDocument());

			await act(async () => {
				(subtitlesButton as HTMLElement).click();
			});

			expect(getTeaser()).not.toBeInTheDocument();
			expect(buttonClick).toHaveBeenCalledTimes(1);
			expect(hasDismissCookie()).toBe(true);
		});

		it('stores the dismissal in a cookie when the preferences were accepted', async () => {
			setPreferencesConsent(true);
			const { root } = createPlayerRoot({ controlsHidden: false });
			renderTeaser(root);
			await waitFor(() => expect(getTeaser()).toBeInTheDocument());

			await act(async () => {
				(getTeaser() as HTMLElement).click();
			});

			expect(hasDismissCookie()).toBe(true);
		});

		it.each([
			['declined', false],
			['not answered yet', undefined],
		])(
			'stores no cookie when the preferences were %s, but still hides it for this visit',
			async (_label, consent) => {
				setPreferencesConsent(consent);
				const { root } = createPlayerRoot({ controlsHidden: false });
				renderTeaser(root);
				await waitFor(() => expect(getTeaser()).toBeInTheDocument());

				await act(async () => {
					(getTeaser() as HTMLElement).click();
				});

				expect(getTeaser()).not.toBeInTheDocument();
				expect(hasDismissCookie()).toBe(false);
			}
		);
	});

	describe('keyboard', () => {
		it('is dismissed with Escape, like a click', async () => {
			const { root } = createPlayerRoot({ controlsHidden: false });
			renderTeaser(root);
			await waitFor(() => expect(getTeaser()).toBeInTheDocument());

			await act(async () => {
				fireEvent.keyDown(getTeaser() as HTMLElement, { key: 'Escape' });
			});

			expect(getTeaser()).not.toBeInTheDocument();
			expect(hasDismissCookie()).toBe(true);
		});

		it.each([
			['keydown', ' '],
			['keyup', ' '],
			['keydown', 'Enter'],
		])(
			'keeps %s of %j away from the player, whose shortcuts would play the video',
			async (type, key) => {
				const { root } = createPlayerRoot({ controlsHidden: false });
				const playerKey = vi.fn();
				root.addEventListener(type, playerKey);
				renderTeaser(root);
				await waitFor(() => expect(getTeaser()).toBeInTheDocument());

				await act(async () => {
					fireEvent[type === 'keydown' ? 'keyDown' : 'keyUp'](getTeaser() as HTMLElement, { key });
				});

				expect(playerKey).not.toHaveBeenCalled();
			}
		);

		it('leaves other keys of the page alone when the teaser has no focus', async () => {
			const { root } = createPlayerRoot({ controlsHidden: false });
			const playerKey = vi.fn();
			root.addEventListener('keydown', playerKey);
			renderTeaser(root);
			await waitFor(() => expect(getTeaser()).toBeInTheDocument());

			fireEvent.keyDown(root, { key: ' ' });

			expect(playerKey).toHaveBeenCalledTimes(1);
			expect(getTeaser()).toBeInTheDocument();
		});
	});
});
