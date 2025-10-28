import { IeObjectType, SimpleIeObjectType } from '@shared/types/ie-objects';

const MAP_DC_TERMS_FORMAT_TO_SIMPLE_TYPE: Record<IeObjectType, SimpleIeObjectType> = {
	[IeObjectType.VIDEO]: SimpleIeObjectType.VIDEO,
	[IeObjectType.VIDEO_FRAGMENT]: SimpleIeObjectType.VIDEO,
	[IeObjectType.AUDIO]: SimpleIeObjectType.AUDIO,
	[IeObjectType.AUDIO_FRAGMENT]: SimpleIeObjectType.AUDIO,
	[IeObjectType.FILM]: SimpleIeObjectType.VIDEO,
	[IeObjectType.NEWSPAPER]: SimpleIeObjectType.NEWSPAPER,
	[IeObjectType.NEWSPAPER_PAGE]: SimpleIeObjectType.NEWSPAPER,
	[IeObjectType.IMAGE]: SimpleIeObjectType.IMAGE,
};

export function mapDcTermsFormatToSimpleType(
	format: IeObjectType | undefined | null
): SimpleIeObjectType | 'unknown' {
	if (!format) {
		return 'unknown';
	}
	return MAP_DC_TERMS_FORMAT_TO_SIMPLE_TYPE[format] || format;
}
