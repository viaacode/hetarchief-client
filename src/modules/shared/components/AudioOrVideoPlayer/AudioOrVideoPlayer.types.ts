import type { IeObjectFile, IeObjectRepresentation } from '@ie-objects/ie-objects.types';
import type { IeObjectType } from '@shared/types/ie-objects';

export interface CuePoints {
	end: number | null;
	start: number | null;
}

export type AudioOrVideoPlayerProps = {
	className?: string;
	allowFullScreen?: boolean;
	paused: boolean;
	onPlay: () => void;
	onPause: () => void;
	onMediaReady: (isAvailable: boolean, playableFile: IeObjectFile | null) => void;
	onMediaDurationLoaded?: (duration: number) => void;
	dctermsFormat: IeObjectType | null;
	schemaIdentifier: string | undefined;
	representation: IeObjectRepresentation | null | undefined;
	maintainerLogo: string | null | undefined;
	cuePoints: CuePoints | undefined;
	locationId: string;
	poster: string | undefined;
	/**
	 * Start and end of the snippet to play, in seconds. When given, they are sent along to the
	 * player-ticket endpoint so the media service delivers only that part, rather than relying on
	 * flowplayer cuepoints, which merely highlights the seek bar.
	 *
	 * Pass both or neither: the media service only cuts when it has an end time.
	 * https://meemoo.atlassian.net/browse/ARC-3832
	 */
	startTime?: number;
	endTime?: number;
};
