import { IeObjectType } from '@shared/types/ie-objects';

const AV_OBJECT_TYPES: IeObjectType[] = [
	IeObjectType.AUDIO,
	IeObjectType.AUDIO_FRAGMENT,
	IeObjectType.FILM,
	IeObjectType.VIDEO,
	IeObjectType.VIDEO_FRAGMENT,
];

/**
 * Tells whether an object plays in the audio or video player.
 */
export function isAvIeObjectType(dctermsFormat: IeObjectType | null | undefined): boolean {
	return !!dctermsFormat && AV_OBJECT_TYPES.includes(dctermsFormat);
}
