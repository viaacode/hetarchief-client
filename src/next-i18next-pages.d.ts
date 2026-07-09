/**
 * Ambient type declaration for the `next-i18next/pages` subpath export.
 *
 * next-i18next v16 exposes the Pages Router API under the `next-i18next/pages` subpath (its root
 * export is now the App Router API). Because this project uses `moduleResolution: "node"` — which
 * does not read package `exports` maps — TypeScript cannot resolve the subpath's bundled types, so
 * we declare the members the app uses here.
 */
declare module 'next-i18next/pages' {
	import type { i18n as I18NextInstance } from 'i18next';
	import type { ComponentType } from 'react';

	/** The global i18next instance, available after appWithTranslation has initialised it. */
	export const i18n: I18NextInstance | null;

	/** HOC that wires next-i18next translations into a Next.js `_app` component. */
	export function appWithTranslation<P extends object>(
		WrappedComponent: ComponentType<P>,
		// biome-ignore lint/suspicious/noExplicitAny: next-i18next accepts a partial user config here
		configOverride?: any
	): ComponentType<P>;
}
