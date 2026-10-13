import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import { type CSSProperties, type FC, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
	CONTROLS_HIDDEN_CLASS,
	SUBTITLES_BUTTON_SELECTOR,
	SUBTITLES_TEASER_COOKIE,
	SUBTITLES_TEASER_COOKIE_MAX_AGE_SECONDS,
	SUBTITLES_TEASER_DURATION_MS,
} from './SubtitlesTeaser.const';
import styles from './SubtitlesTeaser.module.scss';

type CookiebotWindow = Window & { Cookiebot?: { consent?: { preferences?: boolean } } };

interface SubtitlesTeaserProps {
	/** .c-video-player-inner */
	playerRoot: HTMLElement | null;
}

interface TeaserPosition {
	/** The middle of the button, from the player's left edge */
	anchorX: number;
	playerWidth: number;
	/** From the player's bottom to the top of the button */
	buttonOffset: number;
}

const getPosition = (playerRoot: HTMLElement): TeaserPosition | null => {
	const button = playerRoot.querySelector(SUBTITLES_BUTTON_SELECTOR);
	if (!button) {
		return null;
	}

	const rootRect = playerRoot.getBoundingClientRect();
	const buttonRect = button.getBoundingClientRect();
	return {
		anchorX: buttonRect.left - rootRect.left + buttonRect.width / 2,
		playerWidth: rootRect.width,
		buttonOffset: rootRect.bottom - buttonRect.top,
	};
};

/**
 * Call-out at the subtitles button, for 10 seconds from the first time the controls show or the
 * video plays. Playing counts too: selecting an AI entity seeks with a muted play (see
 * seekPlayerVideo), which leaves the controls hidden.
 * Clicking it, pressing Escape on it or opening the subtitles menu dismisses it for good, stored in
 * a cookie when the preferences cookies were accepted. Expiring is not stored: it comes back on the
 * next visit. The countdown waits while it is hovered or focused (WCAG 2.2.1).
 */
export const SubtitlesTeaser: FC<SubtitlesTeaserProps> = ({ playerRoot: candidateRoot }) => {
	// The parent keeps the root of a replaced player until the new one is ready: nothing to point at
	// and no countdown to start then
	const playerRoot = candidateRoot?.isConnected ? candidateRoot : null;
	const [teaser, setTeaser] = useState<HTMLButtonElement | null>(null);

	// Dismissed until the cookie is read, so it never flashes up for someone who dismissed it
	const [isDismissed, setIsDismissed] = useState(true);
	const [isExpired, setIsExpired] = useState(false);
	const [isTriggered, setIsTriggered] = useState(false);
	const [isHeld, setIsHeld] = useState(false);
	const [areControlsVisible, setAreControlsVisible] = useState(false);
	const [position, setPosition] = useState<TeaserPosition | null>(null);

	useEffect(() => {
		setIsDismissed(document.cookie.split('; ').includes(`${SUBTITLES_TEASER_COOKIE}=true`));
	}, []);

	const dismiss = useCallback(() => {
		// Cookiebot's auto blocking holds back scripts, not cookie writes, so check the consent here
		if ((window as CookiebotWindow).Cookiebot?.consent?.preferences) {
			// biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API is not supported in all browsers
			document.cookie = `${SUBTITLES_TEASER_COOKIE}=true; max-age=${SUBTITLES_TEASER_COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax`;
		}
		setIsDismissed(true);
	}, []);

	useEffect(() => {
		if (!playerRoot) {
			return;
		}

		const update = () =>
			setAreControlsVisible(!playerRoot.classList.contains(CONTROLS_HIDDEN_CLASS));
		update();

		const observer = new MutationObserver(update);
		observer.observe(playerRoot, { attributes: true, attributeFilter: ['class'] });
		return () => observer.disconnect();
	}, [playerRoot]);

	useEffect(() => {
		if (areControlsVisible) {
			setIsTriggered(true);
		}
	}, [areControlsVisible]);

	useEffect(() => {
		const video = playerRoot?.querySelector('video');
		if (!video) {
			return;
		}

		const trigger = () => setIsTriggered(true);
		if (!video.paused) {
			trigger();
		}
		video.addEventListener('play', trigger, { once: true });
		return () => video.removeEventListener('play', trigger);
	}, [playerRoot]);

	const isActive = !isDismissed && !isExpired;

	const isShown = isActive && isTriggered && !!position;

	useEffect(() => {
		if (!isShown || isHeld) {
			return;
		}

		const timeout = setTimeout(() => setIsExpired(true), SUBTITLES_TEASER_DURATION_MS);
		return () => clearTimeout(timeout);
	}, [isShown, isHeld]);

	useEffect(() => {
		if (!playerRoot || !isActive) {
			return;
		}

		const update = () => setPosition(getPosition(playerRoot));
		update();

		const observer = new ResizeObserver(update);
		observer.observe(playerRoot);
		return () => observer.disconnect();
	}, [playerRoot, isActive]);

	// Native listeners: a React handler only runs after the event has bubbled through the player,
	// which toggles playback on clicks
	useEffect(() => {
		if (!teaser) {
			return;
		}

		const onClick = (event: Event) => {
			event.stopPropagation();
			dismiss();
		};
		// Keep the player's shortcuts (space plays) from firing for keys meant for the teaser
		const onKeyDown = (event: KeyboardEvent) => {
			event.stopPropagation();
			if (event.key === 'Escape') {
				dismiss();
			}
		};
		const stop = (event: Event) => event.stopPropagation();
		const stoppedTypes = ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'keyup'];

		teaser.addEventListener('click', onClick);
		teaser.addEventListener('keydown', onKeyDown);
		for (const type of stoppedTypes) {
			teaser.addEventListener(type, stop);
		}
		return () => {
			teaser.removeEventListener('click', onClick);
			teaser.removeEventListener('keydown', onKeyDown);
			for (const type of stoppedTypes) {
				teaser.removeEventListener(type, stop);
			}
		};
	}, [teaser, dismiss]);

	// The click is not stopped: the button still has to open its menu
	useEffect(() => {
		if (!playerRoot || !isShown) {
			return;
		}

		const button = playerRoot.querySelector(SUBTITLES_BUTTON_SELECTOR);
		button?.addEventListener('click', dismiss);
		return () => button?.removeEventListener('click', dismiss);
	}, [playerRoot, isShown, dismiss]);

	if (!playerRoot || !isShown) {
		return null;
	}

	return createPortal(
		<button
			ref={setTeaser}
			type="button"
			onPointerEnter={() => setIsHeld(true)}
			onPointerLeave={() => setIsHeld(false)}
			onFocus={() => setIsHeld(true)}
			onBlur={() => setIsHeld(false)}
			className={clsx(
				styles['c-subtitles-teaser'],
				areControlsVisible && styles['c-subtitles-teaser--above-button']
			)}
			style={
				{
					'--subtitles-teaser-anchor-x': `${position.anchorX}px`,
					'--subtitles-teaser-player-width': `${position.playerWidth}px`,
					'--subtitles-teaser-button-offset': `${position.buttonOffset}px`,
				} as CSSProperties
			}
		>
			<Icon name={IconNamesLight.Lightbulb} className={styles['c-subtitles-teaser__icon']} />
			<span className={styles['c-subtitles-teaser__label']}>
				{tText(
					'modules/shared/components/subtitles-teaser/subtitles-teaser___probeer-onze-nieuwe-ai-gegenereerde-ondertiteling'
				)}
			</span>
			<svg
				className={styles['c-subtitles-teaser__arrow']}
				viewBox="0 0 34 13"
				fill="currentColor"
				aria-hidden="true"
			>
				<path d="M30 0C32.2091 0 34 1.79086 34 4C34 6.20914 32.2091 8 30 8H23.1407C21.8033 8 20.5544 8.6684 19.8125 9.7812L18.6641 11.5038C17.8725 12.6913 16.1275 12.6913 15.3359 11.5038L14.1875 9.7812C13.4456 8.6684 12.1967 8 10.8593 8H4C1.79086 8 0 6.20914 0 4C0 1.79086 1.79086 0 4 0H30Z" />
			</svg>
		</button>,
		playerRoot
	);
};
