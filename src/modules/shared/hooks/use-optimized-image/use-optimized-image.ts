import { getOptimizedImageUrls } from '@shared/helpers/optimized-image-urls';
import { useMemo, useState } from 'react';

/**
 * Returns the resized image url for the given display width (css pixels),
 * and an onError handler that switches to the next fallback url when loading fails
 */
const useOptimizedImage = (
	url: string | null | undefined,
	width: number
): [string | undefined, () => void] => {
	const urls = useMemo(() => (url ? getOptimizedImageUrls(url, width) : []), [url, width]);
	const [failedUrls, setFailedUrls] = useState<string[]>([]);

	const src = urls.find((imageUrl) => !failedUrls.includes(imageUrl)) || urls.at(-1);
	const onError = () => {
		if (src && src !== urls.at(-1)) {
			setFailedUrls((previousFailedUrls) => [...previousFailedUrls, src]);
		}
	};

	return [src, onError];
};

export default useOptimizedImage;
