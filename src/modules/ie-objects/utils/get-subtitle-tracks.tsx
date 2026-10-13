import { SUBTITLE_FORMATS } from '@ie-objects/ie-objects.consts';
import type { FlowPlayerProps } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Locale } from '@shared/utils/i18n';
import type { HetArchiefIeObjectFile } from '@viaa/avo2-types';

export type SubtitleTrack = NonNullable<FlowPlayerProps['subtitles']>[number];

const VTT_FORMAT = 'text/vtt';

// A transcript often comes as both VTT and SRT: prefer the VTT, the proxy has to convert the SRT
export const getSubtitleFile = (
	files: HetArchiefIeObjectFile[] | undefined
): HetArchiefIeObjectFile | undefined =>
	files?.find((file) => file.mimeType === VTT_FORMAT) ??
	files?.find((file) => SUBTITLE_FORMATS.includes(file.mimeType));

interface GetSubtitleTracksOptions {
	src: string | undefined;
	label: string;
	disclaimer: string;
}

/**
 * Always Dutch, whatever the interface language. The player matches tracks by label, so it must be
 * unique.
 *
 * No `crossorigin` on the track: the player applies it to the video element, and 'use-credentials'
 * makes the browser refuse the video from the media host, which answers with a wildcard origin.
 */
export const getSubtitleTracks = (
	subtitleFile: HetArchiefIeObjectFile | undefined,
	{ src, label, disclaimer }: GetSubtitleTracksOptions
): SubtitleTrack[] | undefined => {
	if (!subtitleFile || !src) {
		return undefined;
	}

	return [
		{
			id: subtitleFile.id,
			kind: 'subtitles',
			lang: Locale.nl,
			default: false,
			label,
			subLabel: disclaimer,
			src,
			icon: <Icon name={IconNamesLight.Ai} aria-hidden />,
		},
	];
};
