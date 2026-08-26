import { useGetIeObjectBySchemaIdentifier } from '@ie-objects/hooks/use-get-ie-object-by-schema-identifier';
import { useGetIeObjectTicketServiceTokens } from '@ie-objects/hooks/use-get-ie-object-ticket-service-tokens';
import {
	IMAGE_API_FORMATS,
	IMAGE_BROWSE_COPY_FORMATS,
	XML_FORMATS,
} from '@ie-objects/ie-objects.consts';
import { IiifViewer } from '@iiif-viewer/IiifViewer';
import type { ImageInfo, ImageInfoWithToken } from '@iiif-viewer/IiifViewer.types';
import { compact } from 'es-toolkit/compat';
import type { FC } from 'react';
import { useMemo, useState } from 'react';

export interface ContentPageIiifViewerProps {
	schemaIdentifier: string;
	title?: string;
}

/**
 * The IIIF viewer as a content block can use it: hand it an object id and it resolves the rest.
 *
 * Admin-core cannot render the viewer itself. The viewer needs the object's page list and a
 * ticket-service token per page, and both hooks live here. So the client registers this wrapper on
 * `components.iiifViewer` and admin-core only decides where it goes.
 * https://meemoo.atlassian.net/browse/ARC-3813
 *
 * Deliberately a reduced viewer next to the one on the object detail page: no OCR search, no
 * selection or download, and no url state. Those belong to the detail page, and the FA sends the
 * visitor there through the "Bekijk volledig fragment" CTA.
 */
export const ContentPageIiifViewer: FC<ContentPageIiifViewerProps> = ({
	schemaIdentifier,
	title,
}) => {
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [isTextOverlayVisible, setIsTextOverlayVisible] = useState(false);

	const { data: ieObject } = useGetIeObjectBySchemaIdentifier(schemaIdentifier, true);

	// Same mapping the object detail page does: one entry per page, built from the page's own files.
	const imageInfos = useMemo((): ImageInfo[] => {
		return compact(
			ieObject?.pages?.flatMap((page) => {
				const files = page?.representations?.flatMap((representation) => representation.files);
				const imageApiFile =
					files?.find((file) => IMAGE_API_FORMATS.includes(file.mimeType)) ||
					files?.find((file) => file.storedAt.endsWith('jp2'));

				if (!imageApiFile?.storedAt) {
					return null;
				}

				return {
					imageUrl: imageApiFile.storedAt.replace(
						'https://iiif-qas.meemoo.be/image/3/public',
						'https://iiif-qas.meemoo.be/image/3/hetarchief'
					),
					thumbnailUrl: files?.find((file) => IMAGE_BROWSE_COPY_FORMATS.includes(file.mimeType))
						?.thumbnailUrl,
					altoUrl: files?.find((file) => XML_FORMATS.includes(file.mimeType))?.storedAt,
				};
			})
		);
	}, [ieObject?.pages]);

	const { data: ticketServiceTokensByPath } = useGetIeObjectTicketServiceTokens(
		imageInfos.map((imageInfo) => imageInfo.imageUrl),
		schemaIdentifier,
		{ enabled: imageInfos.length > 0 }
	);

	const imageInfosWithTokens = useMemo(
		() =>
			imageInfos.map(
				(imageInfo): ImageInfoWithToken => ({
					...imageInfo,
					// info.json saves a 303, but it can only be appended after the ticket is requested: the
					// ticket's url has to be a substring of the final image url or it is not valid.
					imageUrl: `${imageInfo.imageUrl}/info.json`,
					token: ticketServiceTokensByPath?.[imageInfo.imageUrl] || null,
				})
			),
		[imageInfos, ticketServiceTokensByPath]
	);

	if (!imageInfosWithTokens.length) {
		return null;
	}

	return (
		<IiifViewer
			id={`content-page-iiif-viewer--${schemaIdentifier}`}
			imageInfosWithTokens={imageInfosWithTokens}
			isTextOverlayVisible={isTextOverlayVisible}
			setIsTextOverlayVisible={setIsTextOverlayVisible}
			activeImageIndex={activeImageIndex}
			setActiveImageIndex={setActiveImageIndex}
			onInitialized={() => undefined}
			onPageChanged={setActiveImageIndex}
			// The detail page owns OCR search; here the viewer is only for looking at the pages.
			isSearchEnabled={false}
			searchTerms=""
			setSearchTerms={() => undefined}
			onSearch={() => undefined}
			onClearSearch={() => undefined}
			currentSearchIndex={0}
			searchResults={null}
			setSearchResultIndex={() => undefined}
			enableSelection={false}
			aria-label={title}
		/>
	);
};
