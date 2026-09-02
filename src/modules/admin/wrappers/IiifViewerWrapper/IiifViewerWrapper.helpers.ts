import {
	IMAGE_API_FORMATS,
	IMAGE_BROWSE_COPY_FORMATS,
	XML_FORMATS,
} from '@ie-objects/ie-objects.consts';
import type { ImageInfo } from '@iiif-viewer/IiifViewer.types';
import type { HetArchiefIeObjectPage as IeObjectPage } from '@viaa/avo2-types';
import { compact } from 'es-toolkit/compat';

// 2 newspapers still use this old file format, on QAS only, so this stays hardcoded:
// https://hasura-graphql-qas-hetarchief-v3.private.cloud.meemoo.be/console/data/hetarchief/schema/graph/tables/file/browse?filter=ebucore_has_mime_type%3B%24eq%3Bimage%2Fjp2&filter=premis_stored_at%3B%24ilike%3B%25public%25
const IIIF_PUBLIC_HOST = 'https://iiif-qas.meemoo.be/image/3/public';
const IIIF_HETARCHIEF_HOST = 'https://iiif-qas.meemoo.be/image/3/hetarchief';

/**
 * The IIIF image server only serves the `hetarchief` path with the Authorization header a ticket
 * provides; `public` is what a page's file is actually stored under.
 */
export function toHetarchiefIiifHost(url: string): string {
	return url.replace(IIIF_PUBLIC_HOST, IIIF_HETARCHIEF_HOST);
}

/** A page with no IIIF image file is dropped: there is nothing to show for it. */
export function mapIeObjectPagesToImageInfos(pages: IeObjectPage[] | undefined): ImageInfo[] {
	return compact(
		(pages || []).flatMap((page) => {
			const files = page?.representations?.flatMap((representation) => representation.files || []);
			const imageApiFile =
				files?.find((file) => !!file.mimeType && IMAGE_API_FORMATS.includes(file.mimeType)) ||
				files?.find((file) => file.storedAt?.endsWith('jp2'));

			if (!imageApiFile?.storedAt) {
				return null;
			}

			return {
				imageUrl: toHetarchiefIiifHost(imageApiFile.storedAt),
				thumbnailUrl: files?.find(
					(file) => !!file.mimeType && IMAGE_BROWSE_COPY_FORMATS.includes(file.mimeType)
				)?.thumbnailUrl,
				altoUrl: files?.find((file) => !!file.mimeType && XML_FORMATS.includes(file.mimeType))
					?.storedAt,
			};
		})
	);
}
