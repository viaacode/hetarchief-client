import { NextRequest, NextResponse } from 'next/server';

import { ROUTES } from '@shared/const';

export async function middleware(req: NextRequest): Promise<NextResponse> {
	const { pathname } = req.nextUrl;

	switch (pathname) {
		case ROUTES.myCollections: {
			const defaultCollection = 'favorieten'; // Not even publicRuntimeConfig is available here
			const dest = req.nextUrl.clone();

			dest.pathname = `${ROUTES.myCollections}/${defaultCollection}`;

			return NextResponse.redirect(dest);
		}

		default:
			return NextResponse.next();
	}
}
