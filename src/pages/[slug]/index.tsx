// We need to duplicate this page into /[slug]/[...slug] otherwise we get all kind of nasty page loads for these paths:
// .well-known
// appspecific
// com.chrome.devtools.json
// _next
// static
// webpack
// .*.webpack.hot-update.json

import { GroupName } from '@account/const';
import { selectHasCheckedLogin } from '@auth/store/user';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	makeServerSideRequestGetContentPageByLanguageAndPath,
	useGetContentPageByLanguageAndPath,
} from '@content-page/hooks/get-content-page';
import { ContentPageClientService } from '@content-page/services/content-page-client.service';
import {
	ContentPageRenderer,
	convertDbContentPageToContentPageInfo,
} from '@meemoo/admin-core-ui/client';
import { ErrorNotFound } from '@shared/components/ErrorNotFound';
import { Loading } from '@shared/components/Loading';
import { type PageInfo, SeoTags } from '@shared/components/SeoTags/SeoTags';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { getSlugFromQueryParams } from '@shared/helpers/get-slug-from-query-params';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import withUser, { type UserProps } from '@shared/hooks/with-user';
import { setShowZendesk } from '@shared/store/ui';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils/i18n';
import { isServerSideRendering } from '@shared/utils/is-browser';
import { QueryClient } from '@tanstack/react-query';
import { VisitorLayout } from '@visitor-layout/index';
import type { HTTPError } from 'ky';
import type { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext } from 'next/types';
import { type ComponentType, type FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorNoAccess from '../../modules/shared/components/ErrorNoAccess/ErrorNoAccess';

const { publicRuntimeConfig } = getConfig();

const DynamicRouteResolver: NextPage<DefaultSeoInfo & UserProps> = ({
	title,
	description,
	image,
	url,
	canonicalUrl,
	commonUser,
}) => {
	const router = useRouter();
	const locale = useLocale();
	const hasCheckedLogin: boolean = useSelector(selectHasCheckedLogin);
	const contentPageSlug = getSlugFromQueryParams(router.query);
	const dispatch = useDispatch();
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);

	/**
	 * Data
	 */
	const {
		error: contentPageError,
		isLoading: isContentPageLoading,
		isFetching: isContentPageFetching,
		data: dbContentPage,
	} = useGetContentPageByLanguageAndPath(locale, `/${contentPageSlug}`);
	const contentPageInfo = dbContentPage
		? convertDbContentPageToContentPageInfo(dbContentPage)
		: null;

	/**
	 * Computed
	 */
	const isContentPageNotFoundError = (contentPageError as HTTPError)?.response?.status === 404;

	/**
	 * Effects
	 */

	useEffect(() => {
		if (isContentPageNotFoundError) {
			window.open(`${publicRuntimeConfig.PROXY_URL}/not-found`, '_self');
		}
	}, [isContentPageNotFoundError]);

	useEffect(() => {
		dispatch(setShowZendesk(!isKioskUser));
	}, [dispatch, isKioskUser]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isContentPageLoading || !hasCheckedLogin || (isContentPageFetching && !contentPageInfo)) {
			return <Loading fullscreen owner={'/[slug]/[...deeperslug]/index page'} />;
		}

		if (contentPageInfo) {
			return (
				<>
					<SeoTags
						title={title}
						description={
							description || contentPageInfo?.seoDescription || contentPageInfo?.description || null
						}
						imgUrl={image || contentPageInfo?.thumbnailPath || null}
						translatedPages={contentPageInfo.translatedPages.map(
							(page): PageInfo => ({
								url: page.path as string,
								languageCode: page.language as unknown as Locale,
							})
						)}
						relativeUrl={url}
						canonicalUrl={
							contentPageInfo.translatedPages.find(
								(page) => (page.language as unknown as Locale) === Locale.nl
							)?.path
						}
					/>
					<ContentPageRenderer
						contentPageInfo={contentPageInfo}
						commonUser={commonUser}
						key={contentPageInfo.path}
						renderNoAccessError={() => <ErrorNoAccess visitorSpaceSlug={null} />}
					/>
				</>
			);
		}

		if (!contentPageInfo) {
			if (isServerSideRendering()) {
				// Avoid loading a 404 page in SSR
				// since we don't want to see a 404 error flash before the page loads for logged-in users
				// https://meemoo.atlassian.net/browse/ARC-2857
				return (
					<>
						<SeoTags
							title={title}
							description={description}
							imgUrl={image}
							translatedPages={[]}
							relativeUrl={url}
							canonicalUrl={canonicalUrl}
						/>
						<Loading fullscreen owner={'/[slug]/index page'} />
					</>
				);
			}
			return (
				<>
					<SeoTags
						title={title}
						description={description}
						imgUrl={image}
						translatedPages={[]}
						relativeUrl={url}
						canonicalUrl={canonicalUrl}
					/>
					<ErrorNotFound />
				</>
			);
		}
	};

	return (
		<VisitorLayout>
			<SeoTags
				title={title || 'Het Archief'}
				description={description}
				imgUrl={image}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>
			{renderPageContent()}
		</VisitorLayout>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	let title: string | null = null;
	let description: string | null = null;
	let image: string | null = null;
	const path = getSlugFromQueryParams(context.query);
	const locale = (context.locale || Locale.nl) as Locale;
	const queryClient = new QueryClient();

	if (path && !path.includes('.well-known')) {
		try {
			const contentPage = await ContentPageClientService.getByLanguageAndPath(locale, `/${path}`);
			title = contentPage?.title || null;
			description = contentPage?.seoDescription || contentPage?.description || null;
			image = contentPage?.thumbnailPath || null;
		} catch (err) {
			console.error(`Failed to fetch content page seo info by slug: ${path}`, err);
		}

		await Promise.all([
			makeServerSideRequestGetContentPageByLanguageAndPath(
				queryClient,
				path ? `/${path}` : undefined,
				locale
			),
		]);
	} else {
		title = 'Home - Het Archief';
	}

	return getDefaultStaticProps(context, context.resolvedUrl, {
		queryClient,
		title,
		description,
		image,
	});
}

export default withUser(
	withAuth(DynamicRouteResolver as ComponentType, false)
) as FC<DefaultSeoInfo>;
