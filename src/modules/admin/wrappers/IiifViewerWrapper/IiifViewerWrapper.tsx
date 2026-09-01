import { useGetIeObjectTicketServiceTokens } from '@ie-objects/hooks/use-get-ie-object-ticket-service-tokens';
import { IiifViewer } from '@iiif-viewer/IiifViewer';
import type { ImageInfoWithToken } from '@iiif-viewer/IiifViewer.types';
import type { IiifViewerConfigProps } from '@meemoo/admin-core-ui/client';
import { noop } from 'es-toolkit/compat';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { mapIeObjectPagesToImageInfos } from './IiifViewerWrapper.helpers';

/**
 * The IIIF viewer as a content block can use it. Registered on `components.iiifViewer` because
 * admin-core can neither render the viewer nor resolve a per-page ticket, which is short-lived and
 * access-checked at request time and so can never travel with the object.
 *
 * Deliberately reduced next to the detail page's viewer: no OCR search, selection, download or url
 * state. Those belong to the detail page, which the "Bekijk volledig fragment" CTA links to.
 */
export const IiifViewerWrapper: FC<IiifViewerConfigProps> = ({ ieObject, title }) => {
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
			onInitialized={noop}
			onPageChanged={setActiveImageIndex}
			// The detail page owns OCR search; here the viewer is only for looking at the pages.
			isSearchEnabled={false}
			searchTerms=""
			setSearchTerms={noop}
			onSearch={noop}
			onClearSearch={noop}
			currentSearchIndex={0}
			searchResults={null}
			setSearchResultIndex={noop}
			enableSelection={false}
			aria-label={title}
		/>
	);
};
