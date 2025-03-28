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
		[IeObjectType.Audio]: tText('modules/shared/components/media-card/media-card___audio'),
		[IeObjectType.AudioFragment]: tText('modules/shared/components/media-card/media-card___audio'),
		[IeObjectType.Video]: tText('modules/shared/components/media-card/media-card___video'),
		[IeObjectType.VideoFragment]: tText('modules/shared/components/media-card/media-card___video'),
		[IeObjectType.Film]: tText('modules/shared/components/media-card/media-card___video'),
		[IeObjectType.Newspaper]: tText('modules/shared/components/media-card/media-card___krant'),
	}[type];
}

export const TRUNCATED_TEXT_LENGTH = 50;
