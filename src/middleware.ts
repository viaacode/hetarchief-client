import { NextRequest, NextResponse } from 'next/server';

import { ROUTES } from '@shared/const/routes';

export async function middleware(req: NextRequest): Promise<NextResponse> {
	const { pathname } = req.nextUrl;

	switch (pathname) {
		case ROUTES.myFolders: {
			const defaultCollection = 'favorieten'; // Not even publicRuntimeConfig is available here
			const dest = req.nextUrl.clone();

			dest.pathname = `${ROUTES.myFolders}/${defaultCollection}`;

			return NextResponse.redirect(dest);
		}

		default:
			return NextResponse.next();
	}
}
