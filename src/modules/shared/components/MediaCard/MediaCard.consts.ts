import { IeObjectTypes } from '@shared/types';

import { IconName, IconNamesLight } from '../Icon';

export const TYPE_TO_NO_ICON_MAP: Record<Exclude<IeObjectTypes, null>, IconName> = {
	audio: IconNamesLight.NoAudio,
	video: IconNamesLight.NoVideo,
	film: IconNamesLight.NoVideo,
};

export const TYPE_TO_ICON_MAP: Record<Exclude<IeObjectTypes, null>, IconName> = {
	audio: IconNamesLight.Audio,
	video: IconNamesLight.Video,
	film: IconNamesLight.Video,
};
