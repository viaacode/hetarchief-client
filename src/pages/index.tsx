import { ContentPageRenderer, convertDbContentPageToContentPageInfo } from '@meemoo/admin-core-ui';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ComponentType, FC, useEffect } from 'react';

import { GroupName } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	getContentPageByLanguageAndPath,
	useGetContentPageByLanguageAndPath,
} from '@content-page/hooks/get-content-page';
import { Loading } from '@shared/components';
import { KNOWN_STATIC_ROUTES, QUERY_KEYS, ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils';
import { VisitorLayout } from '@visitor-layout/index';

const Homepage: NextPage<DefaultSeoInfo & UserProps> = ({
	title,
	description,
	image,
	url,
	commonUser,
}) => {
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);
	const router = useRouter();
	const locale = useLocale();

	/**
	 * Data
	 */

	const { isLoading: isContentPageLoading, data: dbContentPage } =
		useGetContentPageByLanguageAndPath(locale, '/');
	const contentPageInfo = dbContentPage
		? convertDbContentPageToContentPageInfo(dbContentPage)
		: null;

	useEffect(() => {
		if (isKioskUser) {
			router.replace(ROUTES_BY_LOCALE[locale].search);
		}
	}, [router, isKioskUser, locale]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isContentPageLoading || isKioskUser) {
			return <Loading fullscreen owner="homepage" />;
		}
		if (contentPageInfo) {
			return (
				<>
					<ContentPageRenderer
						contentPageInfo={contentPageInfo}
						commonUser={commonUser}
					/>
				</>
			);
		}
	};

	return (
		<VisitorLayout>
			{renderOgTags(
				title || null,
				description ||
					contentPageInfo?.seoDescription ||
					contentPageInfo?.description ||
					null,
				url,
				image || contentPageInfo?.thumbnailPath || null
			)}
			{renderPageContent()}
		</VisitorLayout>
	);
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	let title: string | null = null;
	let description: string | null = null;
	let image: string | null = null;
	try {
		const contentPage = await getContentPageByLanguageAndPath(Locale.nl, '/');
		console.log({ contentPage: JSON.stringify(contentPage, null, 2) });
		title = contentPage?.title || null;
		description = contentPage?.seoDescription || contentPage?.description || null;
		image = contentPage?.thumbnailPath || null;
	} catch (err) {
		console.error({
			message: 'Failed to fetch content page seo info for homepage by slug: ',
			innerException: err,
			additionalInfo: {
				path: '/',
			},
		});
	}

	const queryClient = new QueryClient();

	const path = KNOWN_STATIC_ROUTES.Home;
	const language = (context.locale || Locale.nl) as Locale;
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getContentPage, { path, language }],
		queryFn: () => getContentPageByLanguageAndPath(language, path),
	});

	console.log({ queryClientCache: queryClient.getQueryCache() });
	const dehydratedState = dehydrate(queryClient);

	return getDefaultStaticProps(context, dehydratedState, title, description, image);
}

export default withUser(withAuth(Homepage as ComponentType, false)) as FC<DefaultSeoInfo>;
