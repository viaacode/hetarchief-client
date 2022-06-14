import { MediaTypes } from '@shared/types';

export const TYPE_TO_NO_ICON_MAP: Record<Exclude<MediaTypes, null>, 'no-audio' | 'no-video'> = {
	audio: 'no-audio',
	video: 'no-video',
	film: 'no-video',
};
