import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { type IeObjectTypes } from '@shared/types';

import { type IconName } from '../Icon';

export const TYPE_TO_NO_ICON_MAP: Record<Exclude<IeObjectTypes, null>, IconName> = {
	audio: IconNamesLight.NoAudio,
	video: IconNamesLight.NoVideo,
	film: IconNamesLight.NoVideo,
	newspaper: IconNamesLight.NoNewspaper,
};

export const TYPE_TO_ICON_MAP: Record<Exclude<IeObjectTypes, null>, IconName> = {
	audio: IconNamesLight.Audio,
	video: IconNamesLight.Video,
	film: IconNamesLight.Video,
	newspaper: IconNamesLight.Newspaper,
};

export const TRUNCATED_TEXT_LENGTH = 50;
