import { describe, expect, it } from 'vitest';

import { getOptimizedImageUrl, getOptimizedImageUrls } from './optimized-image-urls';

const CMS_IMAGE_URL =
	'https://assets-qas.hetarchief.be/hetarchiefv3/CONTENT_BLOCK_IMAGE/image-uuid.png';
const LOGO_URL = 'https://assets.viaa.be/images/OR-154dn75';
const IMAGE_CACHE_URL = 'https://assets-qas.hetarchief.be/hetarchiefv3/IMAGE_CACHE';

describe('getOptimizedImageUrls', () => {
	it('should return the proxy url, the cached url and the original url', () => {
		expect(getOptimizedImageUrls(CMS_IMAGE_URL, 600)).toEqual([
			`/proxy-url/images/640?url=${encodeURIComponent(CMS_IMAGE_URL)}`,
			`${IMAGE_CACHE_URL}/640/assets-qas.hetarchief.be/hetarchiefv3/CONTENT_BLOCK_IMAGE/image-uuid.webp`,
			CMS_IMAGE_URL,
		]);
	});

	it('should add webp to urls without an extension', () => {
		expect(getOptimizedImageUrls(LOGO_URL, 110)[1]).toEqual(
			`${IMAGE_CACHE_URL}/150/assets.viaa.be/images/OR-154dn75.webp`
		);
	});

	it('should round the width up to an allowed width and cap it at the largest width', () => {
		expect(getOptimizedImageUrl(CMS_IMAGE_URL, 961)).toContain('/images/1280?');
		expect(getOptimizedImageUrl(CMS_IMAGE_URL, 5000)).toContain('/images/2560?');
	});

	it('should only return the original url for images that cannot be resized', () => {
		const urls = [
			'https://media.hetarchief.be/thumbnails/image.jpg',
			'https://assets.hetarchief.be.evil.com/image.png',
			'https://assets.hetarchief.be/hetarchiefv3/CONTENT_BLOCK_IMAGE/logo.svg',
			'/images/waveform.svg',
			'data:image/png;base64,abc',
		];
		for (const url of urls) {
			expect(getOptimizedImageUrls(url, 640)).toEqual([url]);
		}
	});
});
