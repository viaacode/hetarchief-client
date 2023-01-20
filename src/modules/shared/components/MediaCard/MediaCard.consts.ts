import { MediaTypes } from '@shared/types';

import { IconName, IconNamesLight } from '../Icon';

export const TYPE_TO_NO_ICON_MAP: Record<Exclude<MediaTypes, null>, IconName> = {
	audio: IconNamesLight.NoAudio,
	video: IconNamesLight.NoVideo,
	film: IconNamesLight.NoVideo,
};
