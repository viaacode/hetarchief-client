import { type NextRouter } from 'next/router';

/**
 * Go back in browser history, or navigate to a fallback path if the previous page is not from the same domain
 * @param fallbackPath
 * @param router
 */
export async function goBrowserBackWithFallback(fallbackPath: string, router: NextRouter) {
	if (document.referrer.includes(window.location.origin)) {
		router.back();
	} else {
		await router.push(fallbackPath);
	}
}
