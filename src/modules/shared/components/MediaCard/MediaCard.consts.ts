import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { IeObjectType } from '@shared/types/ie-objects';

import type { IconName } from '../Icon';

export const TYPE_TO_NO_ICON_MAP: Record<Exclude<IeObjectType, null>, IconName> = {
	audio: IconNamesLight.NoAudio,
	audiofragment: IconNamesLight.NoAudio,
	video: IconNamesLight.NoVideo,
	videofragment: IconNamesLight.NoVideo, // TODO where does this come from. Shouldn't this be just video?
	film: IconNamesLight.NoVideo,
	newspaper: IconNamesLight.NoNewspaper,
};

export const TYPE_TO_ICON_MAP: Record<Exclude<IeObjectType, null>, IconName> = {
	audio: IconNamesLight.Audio,
	audiofragment: IconNamesLight.Audio,
	video: IconNamesLight.Video,
	videofragment: IconNamesLight.Video,
	film: IconNamesLight.Video,
	newspaper: IconNamesLight.Newspaper,
};

export function GET_TYPE_TO_LABEL_MAP(type: IeObjectType): string | undefined {
	return {
		[IeObjectType.AUDIO]: tText('modules/shared/components/media-card/media-card___audio'),
		[IeObjectType.AUDIO_FRAGMENT]: tText('modules/shared/components/media-card/media-card___audio'),
		[IeObjectType.VIDEO]: tText('modules/shared/components/media-card/media-card___video'),
		[IeObjectType.VIDEO_FRAGMENT]: tText('modules/shared/components/media-card/media-card___video'),
		[IeObjectType.FILM]: tText('modules/shared/components/media-card/media-card___video'),
		[IeObjectType.NEWSPAPER]: tText('modules/shared/components/media-card/media-card___krant'),
	}[type];
}

export const TRUNCATED_TEXT_LENGTH = 50;
