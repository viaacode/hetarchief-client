import { useEffect, useState } from 'react';

const PLAYER_SELECTOR = '.p-object-detail__flowplayer';
// Set by the player's custom control bar on its container while the controls are hidden
// (before the first playback and after the inactivity timeout)
const CONTROLS_HIDDEN_SELECTOR = '.c-video-player-inner--controls-hidden';

/** Whether the detail page player currently shows its controls; follows them as they fade in and out */
export const usePlayerControlsVisible = (isEnabled: boolean): boolean => {
	const [areControlsVisible, setAreControlsVisible] = useState(true);

	useEffect(() => {
		if (!isEnabled) {
			setAreControlsVisible(true);
			return;
		}
		let classObserver: MutationObserver | undefined;
		// The player renders a bit later than the tab that contains it
		const attach = (): boolean => {
			const player = document.querySelector(PLAYER_SELECTOR);
			if (!player) {
				return false;
			}
			const update = () => setAreControlsVisible(!player.querySelector(CONTROLS_HIDDEN_SELECTOR));
			update();
			classObserver = new MutationObserver(update);
			classObserver.observe(player, {
				attributes: true,
				attributeFilter: ['class'],
				childList: true,
				subtree: true,
			});
			return true;
		};
		let playerObserver: MutationObserver | undefined;
		if (!attach()) {
			playerObserver = new MutationObserver(() => {
				if (attach()) {
					playerObserver?.disconnect();
				}
			});
			playerObserver.observe(document.body, { childList: true, subtree: true });
		}
		return () => {
			playerObserver?.disconnect();
			classObserver?.disconnect();
		};
	}, [isEnabled]);

	return areControlsVisible;
};
