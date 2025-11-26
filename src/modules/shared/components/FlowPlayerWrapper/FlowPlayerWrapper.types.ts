import type { IeObjectPage } from '@ie-objects/ie-objects.types';
import type { IeObjectType } from '@shared/types/ie-objects';

export interface CuePoints {
	end: number | null;
	start: number | null;
}

export type FlowPlayerWrapperProps = {
	paused?: boolean;
	onPlay: () => void;
	onPause: () => void;
	onMediaReady: (isAvailable: boolean) => void;
	ieObjectPage: IeObjectPage | null;
	maintainerLogo?: string | null;
	cuePoints?: CuePoints;
	dctermsFormat: IeObjectType | null;
	owner: string;
	duration?: string;
	poster?: string;
};
