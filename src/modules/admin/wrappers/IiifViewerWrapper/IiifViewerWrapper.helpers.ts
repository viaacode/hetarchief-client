import {
	IMAGE_API_FORMATS,
	IMAGE_BROWSE_COPY_FORMATS,
	XML_FORMATS,
} from '@ie-objects/ie-objects.consts';
import type { IeObjectPage } from '@ie-objects/ie-objects.types';
import type { ImageInfo } from '@iiif-viewer/IiifViewer.types';
import { compact } from 'es-toolkit/compat';

const IIIF_PUBLIC_HOST = 'https://iiif-qas.meemoo.be/image/3/public';
const IIIF_HETARCHIEF_HOST = 'https://iiif-qas.meemoo.be/image/3/hetarchief';

export interface IiifViewerWrapperPage {
	imageUrl: string;
	thumbnailUrl: string | null;
	altoUrl: string | null;
}

/**
 * The IIIF image server only serves the `hetarchief` path with the Authorization header a ticket
 * provides; `public` is what a page's file is actually stored under.
 */
export function toHetarchiefIiifHost(url: string): string {
	return url.replace(IIIF_PUBLIC_HOST, IIIF_HETARCHIEF_HOST);
}

/** A caller's own page list (e.g. the driekeuzespeler's proactive fetch), onto ImageInfo. */
export function mapGivenPagesToImageInfos(pages: IiifViewerWrapperPage[]): ImageInfo[] {
	return pages.map((page) => ({
		imageUrl: toHetarchiefIiifHost(page.imageUrl),
		thumbnailUrl: page.thumbnailUrl || undefined,
		altoUrl: page.altoUrl || undefined,
	}));
}

/**
 * The object detail page's own mapping: one entry per page, built from the page's own files. A
 * page with no IIIF image file is dropped -- there is nothing to show for it.
 */
export function mapIeObjectPagesToImageInfos(pages: IeObjectPage[] | undefined): ImageInfo[] {
	return compact(
		(pages || []).flatMap((page) => {
			const files = page?.representations?.flatMap((representation) => representation.files);
			const imageApiFile =
				files?.find((file) => IMAGE_API_FORMATS.includes(file.mimeType)) ||
				files?.find((file) => file.storedAt.endsWith('jp2'));

			if (!imageApiFile?.storedAt) {
				return null;
			}

			return {
				imageUrl: toHetarchiefIiifHost(imageApiFile.storedAt),
				thumbnailUrl: files?.find((file) => IMAGE_BROWSE_COPY_FORMATS.includes(file.mimeType))
					?.thumbnailUrl,
				altoUrl: files?.find((file) => XML_FORMATS.includes(file.mimeType))?.storedAt,
			};
		})
	);
}
