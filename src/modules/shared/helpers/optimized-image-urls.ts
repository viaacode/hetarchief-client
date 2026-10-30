import getConfig from '@shared/config/public-runtime-config';

// Keep in sync with IMAGE_WIDTHS in hetarchief-proxy src/modules/images/images.consts.ts
export const IMAGE_WIDTHS = [150, 320, 640, 960, 1280, 1920, 2560];
const MAX_IMAGE_WIDTH = 2560;

// Only images on our own asset servers can be resized by the proxy
const IMAGE_SOURCE_HOST_REGEX = /^assets(-int|-tst|-qas)?\.(hetarchief|viaa)\.be$/;
const NOT_RESIZABLE_EXTENSION_REGEX = /\.svg$/i;

function getImageWidth(width: number): number {
	return IMAGE_WIDTHS.find((imageWidth) => imageWidth >= width) || MAX_IMAGE_WIDTH;
}

function getResizableImageUrl(url: string | null | undefined): URL | null {
	if (!url) {
		return null;
	}
	try {
		const parsedUrl = new URL(url);
		if (
			parsedUrl.protocol !== 'https:' ||
			!IMAGE_SOURCE_HOST_REGEX.test(parsedUrl.hostname) ||
			NOT_RESIZABLE_EXTENSION_REGEX.test(parsedUrl.pathname)
		) {
			return null;
		}
		return parsedUrl;
	} catch {
		return null;
	}
}

/**
 * Keep in sync with getCacheKey in hetarchief-proxy src/modules/images/services/images.service.ts
 */
function getImageCacheUrl(sourceUrl: URL, width: number): string | null {
	const imageCacheUrl = getConfig().publicRuntimeConfig.ASSET_SERVER_IMAGE_CACHE_URL;
	if (!imageCacheUrl) {
		return null;
	}
	const pathWithoutExtension = sourceUrl.pathname.replace(/\.[a-z0-9]+$/i, '');
	return `${imageCacheUrl}/${width}/${sourceUrl.hostname}${pathWithoutExtension}.webp`;
}

/**
 * Returns the urls to try for an image displayed at the given width (css pixels), in order of preference:
 * - the resized image through the proxy (which itself falls back to the cached copy or the original image)
 * - the resized image cached on the asset server, in case the proxy is unreachable
 * - the original image
 * Images that cannot be resized only return the original url.
 */
export function getOptimizedImageUrls(url: string, width: number): string[] {
	const sourceUrl = getResizableImageUrl(url);
	if (!sourceUrl) {
		return [url];
	}
	const imageWidth = getImageWidth(width);
	const proxyUrl = `${getConfig().publicRuntimeConfig.PROXY_URL}/images/${imageWidth}?url=${encodeURIComponent(url)}`;
	return [proxyUrl, getImageCacheUrl(sourceUrl, imageWidth), url].filter(
		(imageUrl): imageUrl is string => !!imageUrl
	);
}

export function getOptimizedImageUrl(url: string, width: number): string {
	return getOptimizedImageUrls(url, width)[0];
}
