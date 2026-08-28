import { useGetIeObjectBySchemaIdentifier } from '@ie-objects/hooks/use-get-ie-object-by-schema-identifier';
import { useGetIeObjectTicketServiceTokens } from '@ie-objects/hooks/use-get-ie-object-ticket-service-tokens';
import { IiifViewer } from '@iiif-viewer/IiifViewer';
import type { ImageInfoWithToken } from '@iiif-viewer/IiifViewer.types';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import {
	type IiifViewerWrapperPage,
	mapGivenPagesToImageInfos,
	mapIeObjectPagesToImageInfos,
} from './IiifViewerWrapper.helpers';

export interface IiifViewerWrapperProps {
	schemaIdentifier: string;
	title?: string;
	/**
	 * The object's pages, when the caller already has them (e.g. the driekeuzespeler's own
	 * proactive fetch) -- same shape playable-display-data's `pages` field returns. Given this,
	 * the wrapper skips useGetIeObjectBySchemaIdentifier entirely: the one thing it still has to
	 * resolve itself is a ticket-service token per image, since a ticket is short-lived and
	 * access-checked at request time, so it can never travel with a prefetched page list. Omit it
	 * and the wrapper falls back to resolving the full object (and its page list) itself, exactly
	 * as it always has, for a caller that has only an id.
	 */
	pages?: IiifViewerWrapperPage[];
}

/**
 * The IIIF viewer as a content block can use it: hand it an object id (and, optionally, a page
 * list it already resolved) and it takes care of the rest.
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
export const IiifViewerWrapper: FC<IiifViewerWrapperProps> = ({ schemaIdentifier, title, pages }) => {
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [isTextOverlayVisible, setIsTextOverlayVisible] = useState(false);

	// Only resolved when the caller didn't already hand over a page list.
	const { data: ieObject } = useGetIeObjectBySchemaIdentifier(schemaIdentifier, true, {
		enabled: !pages,
	});

	const imageInfos = useMemo(
		() => (pages ? mapGivenPagesToImageInfos(pages) : mapIeObjectPagesToImageInfos(ieObject?.pages)),
		[pages, ieObject?.pages]
	);

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
