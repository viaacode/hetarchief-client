import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Locale } from '../tests/helpers/get-site-translations';

interface IeObjectRedirectInfo {
	schema_identifier: string;
	maintainerSlug: string;
	title: string;
}

export async function middleware(request: NextRequest) {
	try {
		console.log('middleware triggered for URL: ', request.url);
		const pathName = request.nextUrl.pathname;

		// https://meemoo.atlassian.net/browse/ARC-3185
		if (pathName === '/sitemap.xml.gz') {
			return new NextResponse('Not found', { status: 404 });
		}

		// Handle media mosa ids and redirect them to the equivalent ie-object page
		if (
			pathName.startsWith('/media/') ||
			pathName.startsWith('/nl/media/') ||
			pathName.startsWith('/en/media/')
		) {
			const pathParts = pathName.split('/media/');
			const mediaMosaId = pathParts.pop()?.split('/').pop();
			if (!mediaMosaId) {
				console.error('No mediaMosaId found in the URL: ', pathName);
				return NextResponse.next();
			}
			const ieObjectRedirectInfo: IeObjectRedirectInfo = (await (
				await fetch(`${process.env.PROXY_URL}/ie-objects/lookup/nvdgo/${mediaMosaId}`)
			).json()) as IeObjectRedirectInfo;
			const schemaIdentifier = ieObjectRedirectInfo.schema_identifier;
			if (!schemaIdentifier) {
				console.error(
					'Fetching the schemaIdentifier for the nvdgo id failed: ',
					ieObjectRedirectInfo
				);
				return NextResponse.rewrite(new URL('/__force-404', request.url));
			}
			const search = pathName.startsWith(`/${Locale.En}/`)
				? `${Locale.En}/${ROUTE_PARTS_BY_LOCALE.en.search}`
				: ROUTE_PARTS_BY_LOCALE.nl.search;
			const maintainerSlug = ieObjectRedirectInfo.maintainerSlug;
			const title = ieObjectRedirectInfo.title ? ieObjectRedirectInfo.title.replace(/ /g, '-') : '';

			return NextResponse.redirect(
				new URL(`/${search}/${maintainerSlug}/${schemaIdentifier}/${title}`, request.url)
			);
		}

		// Other routes are not handled by this middleware
		return NextResponse.next();
	} catch (err) {
		console.error('Error in middleware: ', err);
		return NextResponse.rewrite(new URL('/__force-404', request.url));
	}
}

export const config = {
	matcher: ['/media/:path*', '/:locale/media/:path*', '/sitemap.xml.gz'],
};
