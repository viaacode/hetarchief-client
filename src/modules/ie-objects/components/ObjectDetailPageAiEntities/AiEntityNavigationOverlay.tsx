import { AiEntityPortrait } from '@ie-objects/components/ObjectDetailPageAiEntities/AiEntityPortrait';
import type { AiEntity } from '@ie-objects/utils/map-ai-entities';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import useIsomorphicLayoutEffect from '@shared/hooks/use-isomorphic-layout-effect';
import {
	CONTROLS_HIDDEN_CLASS,
	usePlayerControlsVisible,
} from '@shared/hooks/use-player-controls-visible';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './AiEntityNavigationOverlay.module.scss';

// The player toggles playback on the pointer events and its keyboard plugin takes Space and the
// arrows from any focus inside it, which would swallow the buttons' own activation. Every key is
// stopped, so document-level key listeners do not see keys pressed while a button has focus.
const PLAYER_EVENTS = [
	'click',
	'pointerdown',
	'mousedown',
	'touchstart',
	'touchend',
	'keydown',
	'keyup',
];

// A click is included for assistive tech, which activates a button without a touch or key event
const WAKING_EVENTS = ['touchstart', 'keydown', 'click'];

export interface AiEntityNavigationOverlayProps {
	/** The flowplayer element (.c-video-player-inner) the bar is rendered in */
	playerRoot: HTMLElement | null;
	/** The entity whose interval was selected last */
	entity: AiEntity;
	intervalIndex: number;
	onSelectInterval: (intervalIndex: number) => void;
	/** Clears the selection */
	onClose: () => void;
}

// Mobile only: the cards sit on the metadata tab, so this bar over the player is how a user
// steps through the moments of the selected entity while watching.
// It is rendered inside the player: the player hides its controls when the pointer leaves it,
// which hovering a bar outside of it would do. It sits above the controls while they show and
// moves down to the bottom edge while they are hidden.
export const AiEntityNavigationOverlay: FC<AiEntityNavigationOverlayProps> = ({
	playerRoot: candidateRoot,
	entity,
	intervalIndex,
	onSelectInterval,
	onClose,
}) => {
	// The parent keeps the root of a replaced player until the new one is ready: nothing to render in
	const playerRoot = candidateRoot?.isConnected ? candidateRoot : null;
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const areControlsVisible = usePlayerControlsVisible(playerRoot);

	// Own container, so the events can be stopped before they reach the player while React, which
	// listens on the container of a portal, still gets them for the buttons.
	// Layout effect: the bar is in place before the first paint.
	useIsomorphicLayoutEffect(() => {
		if (!playerRoot) {
			return;
		}

		const element = document.createElement('div');
		const stop = (event: Event) => {
			event.stopPropagation();
			// The player takes a touch, a key or a click as the user being active: without it the
			// controls hide while the user steps through moments and the bar drops under their finger.
			// Not while they are hidden, which would raise the bar from under the tap. A mouse move needs
			// no help: it is not stopped.
			if (
				WAKING_EVENTS.includes(event.type) &&
				!playerRoot.classList.contains(CONTROLS_HIDDEN_CLASS)
			) {
				// On the root itself, where the player listens, so nothing above it sees it
				playerRoot.dispatchEvent(new MouseEvent('mousemove'));
			}
		};
		for (const type of PLAYER_EVENTS) {
			element.addEventListener(type, stop);
		}
		playerRoot.appendChild(element);
		setContainer(element);
		return () => {
			element.remove();
			setContainer(null);
		};
	}, [playerRoot]);

	if (!container) {
		return null;
	}

	const total = entity.intervals.length;

	return createPortal(
		<div
			className={clsx(styles['c-ai-entity-navigation-overlay'], {
				[styles['c-ai-entity-navigation-overlay--raised']]: areControlsVisible,
			})}
		>
			<div className={styles['c-ai-entity-navigation-overlay__bar']}>
				<AiEntityPortrait
					className={styles['c-ai-entity-navigation-overlay__portrait']}
					entity={entity}
					size="xs"
				/>
				<span className={styles['c-ai-entity-navigation-overlay__name']}>{entity.name}</span>

				<div className={styles['c-ai-entity-navigation-overlay__controls']}>
					<Button
						icon={<Icon name={IconNamesLight.AngleLeft} aria-hidden />}
						ariaLabel={tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-navigation-overlay___vorig-moment'
						)}
						className={styles['c-ai-entity-navigation-overlay__button']}
						disabled={intervalIndex <= 0}
						variants={['sm', 'text', 'white']}
						onClick={() => onSelectInterval(intervalIndex - 1)}
					/>
					{/* Live, so a screen reader hears the new position after previous / next */}
					<span
						className={styles['c-ai-entity-navigation-overlay__count']}
						aria-live="polite"
						aria-atomic="true"
					>
						{tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-navigation-overlay___index-van-total',
							{ index: intervalIndex + 1, total }
						)}
					</span>
					<Button
						icon={<Icon name={IconNamesLight.AngleRight} aria-hidden />}
						ariaLabel={tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-navigation-overlay___volgend-moment'
						)}
						className={styles['c-ai-entity-navigation-overlay__button']}
						disabled={intervalIndex >= total - 1}
						variants={['sm', 'text', 'white']}
						onClick={() => onSelectInterval(intervalIndex + 1)}
					/>
					<span className={styles['c-ai-entity-navigation-overlay__divider']} aria-hidden />
					<Button
						icon={<Icon name={IconNamesLight.Times} aria-hidden />}
						ariaLabel={tText(
							'modules/ie-objects/components/object-detail-page-ai-entities/ai-entity-navigation-overlay___sluiten'
						)}
						className={styles['c-ai-entity-navigation-overlay__button']}
						variants={['sm', 'text', 'white']}
						onClick={onClose}
					/>
				</div>
			</div>
		</div>,
		container
	);
};
