import { useGetIeObjectTicketServiceTokens } from '@ie-objects/hooks/use-get-ie-object-ticket-service-tokens';
import { IiifViewer } from '@iiif-viewer/IiifViewer';
import type { ImageInfoWithToken } from '@iiif-viewer/IiifViewer.types';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import {
	type IiifViewerWrapperPage,
	mapIeObjectPagesToImageInfos,
} from './IiifViewerWrapper.helpers';

export interface IiifViewerWrapperProps {
	/** The whole ie-object, resolved by the caller. Its pages are what the viewer renders. */
	ieObject: {
		schemaIdentifier: string;
		pages?: IiifViewerWrapperPage[];
	};
	title?: string;
}

/**
 * The IIIF viewer as a content block can use it: hand it an ie-object and it takes care of the rest.
 *
 * Admin-core cannot render the viewer itself, and it cannot resolve a ticket-service token per page
 * either -- a ticket is short-lived and access-checked at request time, so it can never travel with
 * the object. So the client registers this wrapper on `components.iiifViewer` and admin-core only
 * decides where it goes. https://meemoo.atlassian.net/browse/ARC-3813
 *
 * Deliberately a reduced viewer next to the one on the object detail page: no OCR search, no
 * selection or download, and no url state. Those belong to the detail page, and the FA sends the
 * visitor there through the "Bekijk volledig fragment" CTA.
 */
export const IiifViewerWrapper: FC<IiifViewerWrapperProps> = ({ ieObject, title }) => {
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [isTextOverlayVisible, setIsTextOverlayVisible] = useState(false);

	const imageInfos = useMemo(() => mapIeObjectPagesToImageInfos(ieObject.pages), [ieObject.pages]);

	const { data: ticketServiceTokensByPath } = useGetIeObjectTicketServiceTokens(
		imageInfos.map((imageInfo) => imageInfo.imageUrl),
		ieObject.schemaIdentifier,
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
			id={`content-page-iiif-viewer--${ieObject.schemaIdentifier}`}
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
