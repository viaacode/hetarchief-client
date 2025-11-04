import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { type IeObjectType, SimpleIeObjectType } from '@shared/types/ie-objects';

import { mapDcTermsFormatToSimpleType } from '@ie-objects/utils/map-dc-terms-format-to-simple-type';
import type { IconName } from '../Icon';

export function getIconFromObjectType(type: IeObjectType, accessible: boolean): IconName {
	const simpleType = mapDcTermsFormatToSimpleType(type);
	if (accessible) {
		return {
			[SimpleIeObjectType.VIDEO]: IconNamesLight.Video,
			[SimpleIeObjectType.AUDIO]: IconNamesLight.Audio,
			[SimpleIeObjectType.NEWSPAPER]: IconNamesLight.Newspaper,
			[SimpleIeObjectType.IMAGE]: IconNamesLight.Image,
			unknown: IconNamesLight.File,
		}[simpleType];
	}
	return {
		[SimpleIeObjectType.VIDEO]: IconNamesLight.NoVideo,
		[SimpleIeObjectType.AUDIO]: IconNamesLight.NoAudio,
		[SimpleIeObjectType.NEWSPAPER]: IconNamesLight.NoNewspaper,
		[SimpleIeObjectType.IMAGE]: IconNamesLight.NoImage,
		unknown: IconNamesLight.NoFile,
	}[simpleType];
}

export function GET_TYPE_TO_ICON_MAP(type: IeObjectType, accessible: boolean): IconName {
	const simpleType = mapDcTermsFormatToSimpleType(type);
	return {
		[SimpleIeObjectType.VIDEO]: IconNamesLight.Video,
		[SimpleIeObjectType.AUDIO]: IconNamesLight.Audio,
		[SimpleIeObjectType.NEWSPAPER]: IconNamesLight.Newspaper,
		[SimpleIeObjectType.IMAGE]: IconNamesLight.Image,
		unknown: IconNamesLight.File,
	}[simpleType];
}

export function GET_TYPE_TO_LABEL_MAP(type: IeObjectType): string | undefined {
	const simpleType = mapDcTermsFormatToSimpleType(type);
	return {
		[SimpleIeObjectType.AUDIO]: tText('modules/shared/components/media-card/media-card___audio'),
		[SimpleIeObjectType.VIDEO]: tText('modules/shared/components/media-card/media-card___video'),
		[SimpleIeObjectType.NEWSPAPER]: tText(
			'modules/shared/components/media-card/media-card___krant'
		),
		[SimpleIeObjectType.IMAGE]: tText(
			'modules/shared/components/media-card/media-card___afbeelding'
		),
		unknown: tText('modules/shared/components/media-card/media-card___object-type-niet-gekend'),
	}[simpleType];
}

export const TRUNCATED_TEXT_LENGTH = 50;
