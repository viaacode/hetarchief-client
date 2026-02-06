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
	representation: IeObjectRepresentation | null | undefined;
	maintainerLogo: string | null | undefined;
	cuePoints: CuePoints | undefined;
	locationId: string;
	poster: string | undefined;
};
