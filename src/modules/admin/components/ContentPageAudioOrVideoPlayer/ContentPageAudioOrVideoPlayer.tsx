import { ObjectPlaceholder } from '@ie-objects/components/ObjectPlaceholder';
import { useGetIeObjectBySchemaIdentifier } from '@ie-objects/hooks/use-get-ie-object-by-schema-identifier';
import { FLOWPLAYER_FORMATS, getTicketErrorPlaceholderLabels } from '@ie-objects/ie-objects.consts';
import type { IeObjectRepresentation } from '@ie-objects/ie-objects.types';
import type { AudioOrVideoPlayerWrapperProps } from '@meemoo/admin-core-ui/client';
import { AudioOrVideoPlayer } from '@shared/components/AudioOrVideoPlayer/AudioOrVideoPlayer';
import Loading from '@shared/components/Loading/Loading';
import { noop } from 'es-toolkit';
import type { FC } from 'react';

/**
 * Adapts the admin-core's "Videoblok" content block to the client's own AV player.
 *
 * The admin-core only knows which object and which part of it should play; turning a pid into a
 * representation with a playable file is client knowledge, so it happens here. Registered on the
 * admin-core config as `components.audioOrVideoPlayer`.
 *
 * Fetching here also gets us the v2 -> v3 pid conversion in useGetIeObjectBySchemaIdentifier for
 * free, so an editor can paste an older pid.
 *
 * https://meemoo.atlassian.net/browse/ARC-3832
 */
export const ContentPageAudioOrVideoPlayer: FC<AudioOrVideoPlayerWrapperProps> = ({
	schemaIdentifier,
	startTime,
	endTime,
	poster,
	title,
	className,
}) => {
	const {
		data: ieObject,
		isLoading,
		isError,
	} = useGetIeObjectBySchemaIdentifier(schemaIdentifier, true, { enabled: !!schemaIdentifier });

	if (isLoading) {
		return <Loading locationId="content-page-video-block" mode="light" />;
	}

	// The object may simply not be viewable by this visitor: content pages are public, but the
	// player-ticket endpoint still applies the licence and visitor-space checks.
	const representation: IeObjectRepresentation | undefined = (ieObject?.pages || [])
		.flatMap((page) => page?.representations || [])
		.find((candidate) =>
			candidate.files?.some((file) => FLOWPLAYER_FORMATS.includes(file.mimeType))
		);

	if (isError || !ieObject || !representation) {
		return <ObjectPlaceholder {...getTicketErrorPlaceholderLabels()} />;
	}

	return (
		<AudioOrVideoPlayer
			className={className}
			schemaIdentifier={ieObject.schemaIdentifier}
			representation={representation}
			dctermsFormat={ieObject.dctermsFormat}
			maintainerLogo={ieObject.maintainerLogo}
			poster={poster}
			startTime={startTime}
			endTime={endTime}
			// The snippet is cut server side, so no flowplayer cuepoints are needed on top of it.
			cuePoints={undefined}
			paused={false}
			onPlay={noop}
			onPause={noop}
			onMediaReady={noop}
			locationId={`content-page-video-block--${ieObject.schemaIdentifier}`}
			// The accessibility title is set by the editor on the block; the player falls back to
			// the file name when it is empty.
			aria-label={title}
		/>
	);
};
