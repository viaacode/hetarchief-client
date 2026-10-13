import { useEffect, useState } from 'react';

// Set by react-components' control bar on the player root while the controls are hidden
// (before the first playback and after the inactivity timeout)
export const CONTROLS_HIDDEN_CLASS = 'c-video-player-inner--controls-hidden';

/** Whether the player shows its controls; false until there is a player root to read it from */
export const usePlayerControlsVisible = (playerRoot: HTMLElement | null): boolean => {
	// Read in the first render too, so a player that is already there does not flash as hidden
	const [areControlsVisible, setAreControlsVisible] = useState(
		() => !!playerRoot && !playerRoot.classList.contains(CONTROLS_HIDDEN_CLASS)
	);

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

	// Derived, so a player that is gone is not visible in the same render, not after the effect
	return !!playerRoot && areControlsVisible;
};
