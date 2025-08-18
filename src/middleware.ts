import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface IeObjectRedirectInfo {
	schema_identifier: string;
	maintainerSlug: string;
	title: string;
}

export async function middleware(request: NextRequest) {
	const pathName = request.nextUrl.pathname;
	const pathParts = pathName.split('/media/');
	const mediaMosaId = pathParts.pop()?.split('/').pop();
	if (!mediaMosaId) {
		console.error('No mediaMosaId found in the URL: ', pathName);
		return NextResponse.next();
	}
	const ieObjectRedirectInfo: IeObjectRedirectInfo = (await (
		await fetch(`${process.env.PROXY_URL}/ie-objects/lookup/nvdgo/${mediaMosaId}`)
	).json()) as IeObjectRedirectInfo;
	const search = pathName.startsWith('/en/') ? 'en/search' : 'zoeken';
	const maintainerSlug = ieObjectRedirectInfo.maintainerSlug;
	const schemaIdentifier = ieObjectRedirectInfo.schema_identifier;
	const title = ieObjectRedirectInfo.title ? ieObjectRedirectInfo.title.replace(/ /g, '-') : '';

	return NextResponse.redirect(
		new URL(`/${search}/${maintainerSlug}/${schemaIdentifier}/${title}`, request.url)
	);
}

export const config = {
	matcher: ['/media/:path*', '/:locale/media/:path*'],
};
