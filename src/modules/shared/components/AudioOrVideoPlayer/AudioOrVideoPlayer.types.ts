import type { IeObjectFile, IeObjectRepresentation } from '@ie-objects/ie-objects.types';
import type { CuePoints } from '@meemoo/admin-core-ui/admin';
import type { IeObjectType } from '@shared/types/ie-objects';

export type AudioOrVideoPlayerProps = {
	className?: string;
	allowFullScreen?: boolean;
	isPaused: boolean;
	autoplay?: boolean;
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
	onTimeUpdate?: (newTime: number) => void;
};
