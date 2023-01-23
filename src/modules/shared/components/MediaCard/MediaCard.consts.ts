import { MediaTypes } from '@shared/types';

import { IconName } from '../Icon';

export const TYPE_TO_NO_ICON_MAP: Record<Exclude<MediaTypes, null>, 'no-audio' | 'no-video'> = {
	audio: 'no-audio',
	video: 'no-video',
	film: 'no-video',
};

export const TYPE_TO_ICON_MAP: Record<Exclude<MediaTypes, null>, IconName> = {
	audio: 'audio',
	video: 'video',
	film: 'video',
};
