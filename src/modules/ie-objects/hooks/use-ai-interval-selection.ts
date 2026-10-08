import {
	FileMentionEntityType,
	type FileMentionsResponse,
	ObjectDetailTabs,
} from '@ie-objects/ie-objects.types';
import {
	type ActiveAiInterval,
	type AiEntity,
	mapFileMentionsToAiEntities,
} from '@ie-objects/utils/map-ai-entities';
import { getPlayerVideoElement, seekPlayerVideo } from '@ie-objects/utils/seek-player-video';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { noop } from 'es-toolkit/compat';
import { parseUrl } from 'query-string';
import { useCallback, useEffect, useRef, useState } from 'react';

// undefined removes a query param
const NO_AI_INTERVAL_QUERY = {
	[QUERY_PARAM_KEY.ACTIVE_AI_ENTITY]: undefined,
	[QUERY_PARAM_KEY.ACTIVE_AI_INTERVAL]: undefined,
};

interface UseAiIntervalSelectionProps {
	fileMentions: FileMentionsResponse | undefined;
	/** The file the player plays, which is also the file the AI entities belong to */
	currentPlayableFileId: string | null;
	isMobile: boolean;
	activeTab: ObjectDetailTabs;
	updateActiveTab: (
		tab: ObjectDetailTabs | null,
		extraQuery?: Record<string, string | undefined>
	) => Promise<void>;
	updateQueryParams: (patch: Record<string, string | undefined>) => Promise<void>;
}

/**
 * The AI interval that is highlighted, across persons, places and organisations: selecting one
 * seeks the player, keeps the url in sync and, on mobile, brings the player (Media tab) into view.
 */
export const useAiIntervalSelection = ({
	fileMentions,
	currentPlayableFileId,
	isMobile,
	activeTab,
	updateActiveTab,
	updateQueryParams,
}: UseAiIntervalSelectionProps) => {
	// It belongs to the file that plays, so it goes when another file is shown
	const [activeAiInterval, setActiveAiInterval] = useState<ActiveAiInterval | null>(null);
	const previousPlayableFileIdRef = useRef<string | null>(null);
	// biome-ignore lint/correctness/useExhaustiveDependencies: reset whenever the played file changes
	useEffect(() => {
		const previousFileId = previousPlayableFileIdRef.current;
		previousPlayableFileIdRef.current = currentPlayableFileId;
		setActiveAiInterval(null);
		// Not on load (no previous file): the url still has to be restored from
		if (previousFileId && previousFileId !== currentPlayableFileId) {
			const { query } = parseUrl(window.location.href);
			if (query[QUERY_PARAM_KEY.ACTIVE_AI_ENTITY] || query[QUERY_PARAM_KEY.ACTIVE_AI_INTERVAL]) {
				updateQueryParams(NO_AI_INTERVAL_QUERY).then(noop);
			}
		}
	}, [currentPlayableFileId]);

	// A seek asked for while the player isn't rendered yet (mobile, on another tab; or a restore
	// on load) waits here for it. State, so the effect below runs when a seek is queued.
	const [pendingSeekSeconds, setPendingSeekSeconds] = useState<number | null>(null);

	// Seeks only: the player keeps playing or staying paused
	const seekPlayer = useCallback((seconds: number) => {
		const video = getPlayerVideoElement();
		if (video) {
			seekPlayerVideo(video, seconds);
			setPendingSeekSeconds(null);
		} else {
			setPendingSeekSeconds(seconds);
		}
	}, []);

	// A refresh or a shared link restores the interval from the URL, once
	const hasRestoredAiIntervalRef = useRef(false);
	useEffect(() => {
		if (!fileMentions || hasRestoredAiIntervalRef.current) {
			return;
		}
		hasRestoredAiIntervalRef.current = true;
		const { query } = parseUrl(window.location.href);
		const entityId = query[QUERY_PARAM_KEY.ACTIVE_AI_ENTITY];
		const intervalIndex = Number(query[QUERY_PARAM_KEY.ACTIVE_AI_INTERVAL]);
		const entity = [
			FileMentionEntityType.PERSON,
			FileMentionEntityType.PLACE,
			FileMentionEntityType.ORGANIZATION,
		]
			.flatMap((type) => mapFileMentionsToAiEntities(fileMentions.mentions, type))
			.find((candidate) => candidate.id === entityId);
		// Without access to the essence the intervals can't be selected, whatever the url says
		if (fileMentions.hasAccessToEssence && entity?.intervals[intervalIndex]) {
			setActiveAiInterval({ entity, intervalIndex });
			seekPlayer(entity.intervals[intervalIndex].start);
		}
	}, [fileMentions, seekPlayer]);

	// The player isn't there yet on load, and on mobile only exists on the Media tab, a few renders after it opens
	useEffect(() => {
		if (pendingSeekSeconds === null || (isMobile && activeTab !== ObjectDetailTabs.Media)) {
			return;
		}
		const applyPendingSeek = (): boolean => {
			const video = getPlayerVideoElement();
			if (!video) {
				return false;
			}
			seekPlayerVideo(video, pendingSeekSeconds);
			if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
				// The position can be reset while the media loads
				video.addEventListener('loadedmetadata', () => seekPlayerVideo(video, pendingSeekSeconds), {
					once: true,
				});
			}
			setPendingSeekSeconds(null);
			return true;
		};
		if (applyPendingSeek()) {
			return;
		}
		const observer = new MutationObserver(() => {
			if (applyPendingSeek()) {
				observer.disconnect();
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, [pendingSeekSeconds, isMobile, activeTab]);

	const selectAiInterval = useCallback(
		(entity: AiEntity, intervalIndex: number) => {
			setActiveAiInterval({ entity, intervalIndex });
			seekPlayer(entity.intervals[intervalIndex].start);
			const aiIntervalQuery = {
				[QUERY_PARAM_KEY.ACTIVE_AI_ENTITY]: entity.id,
				[QUERY_PARAM_KEY.ACTIVE_AI_INTERVAL]: String(intervalIndex),
			};
			if (isMobile && activeTab !== ObjectDetailTabs.Media) {
				// On mobile the player is on the Media tab, so show it
				updateActiveTab(ObjectDetailTabs.Media, aiIntervalQuery).then(noop);
			} else {
				updateQueryParams(aiIntervalQuery).then(noop);
			}
		},
		[seekPlayer, isMobile, activeTab, updateActiveTab, updateQueryParams]
	);

	const clearAiInterval = useCallback(() => {
		setActiveAiInterval(null);
		updateQueryParams(NO_AI_INTERVAL_QUERY).then(noop);
	}, [updateQueryParams]);

	return { activeAiInterval, selectAiInterval, clearAiInterval };
};
