import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { useLocalStorage } from '@shared/hooks/use-localStorage/use-local-storage';
import { usePlayerControlsVisible } from '@shared/hooks/use-player-controls-visible';
import clsx from 'clsx';
import { type CSSProperties, type FC, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
	SUBTITLES_BUTTON_SELECTOR,
	SUBTITLES_TEASER_DURATION_MS,
	SUBTITLES_TEASER_STORAGE_KEY,
} from './SubtitlesTeaser.const';
import styles from './SubtitlesTeaser.module.scss';

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
 * localStorage. Expiring is not stored: it comes back on the next visit. The countdown waits while it is hovered or focused (WCAG 2.2.1).
 */
export const SubtitlesTeaser: FC<SubtitlesTeaserProps> = ({ playerRoot: candidateRoot }) => {
	// The parent keeps the root of a replaced player until the new one is ready: nothing to point at
	// and no countdown to start then
	const playerRoot = candidateRoot?.isConnected ? candidateRoot : null;
	const [teaser, setTeaser] = useState<HTMLButtonElement | null>(null);

	const [storedDismissal, setStoredDismissal] = useLocalStorage(
		SUBTITLES_TEASER_STORAGE_KEY,
		'false'
	);
	const isDismissed = storedDismissal === 'true';
	const [isExpired, setIsExpired] = useState(false);
	const [isTriggered, setIsTriggered] = useState(false);
	const [isHeld, setIsHeld] = useState(false);
	const [position, setPosition] = useState<TeaserPosition | null>(null);
	const areControlsVisible = usePlayerControlsVisible(playerRoot);

	const dismiss = useCallback(() => setStoredDismissal('true'), [setStoredDismissal]);

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
			<span className={styles['c-subtitles-teaser__arrow']} aria-hidden="true" />
		</button>,
		playerRoot
	);
};
