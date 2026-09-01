import {
	IMAGE_API_FORMATS,
	IMAGE_BROWSE_COPY_FORMATS,
	XML_FORMATS,
} from '@ie-objects/ie-objects.consts';
import type { ImageInfo } from '@iiif-viewer/IiifViewer.types';
import type { IiifViewerConfigProps } from '@meemoo/admin-core-ui/client';
import { compact } from 'es-toolkit/compat';

// Hardcoded rather than derived from IIIF_IMAGE_API: only 2 newspaper files on QAS still carry the
// /public/ path, and none do on production.
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
export function mapIeObjectPagesToImageInfos(
	pages: IiifViewerConfigProps['ieObject']['pages']
): ImageInfo[] {
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
