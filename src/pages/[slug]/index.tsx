// We need to duplicate this page into /[slug]/[...slug] otherwise we get all kind of nasty page loads for these paths:
// .well-known
// appspecific
// com.chrome.devtools.json
// _next
// static
// webpack
// .*.webpack.hot-update.json
import { ContentPageRenderer, convertDbContentPageToContentPageInfo } from '@meemoo/admin-core-ui/admin';
import { QueryClient } from '@tanstack/react-query';
import type { HTTPError } from 'ky';
import { kebabCase } from 'lodash-es';
import type { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext } from 'next/types';
import { type ComponentType, type FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { GroupName } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	makeServerSideRequestGetContentPageByLanguageAndPath,
	useGetContentPageByLanguageAndPath,
} from '@content-page/hooks/get-content-page';
import { ContentPageClientService } from '@content-page/services/content-page-client.service';
import { makeServerSideRequestGetIeObjectInfo, useGetIeObjectInfo } from '@ie-objects/hooks/use-get-ie-objects-info';
import { makeServerSideRequestGetIeObjectThumbnail } from '@ie-objects/hooks/use-get-ie-objects-thumbnail';
import { ErrorNotFound } from '@shared/components/ErrorNotFound';
import { Loading } from '@shared/components/Loading';
import { type PageInfo, SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { getSlugFromQueryParams } from '@shared/helpers/get-slug-from-query-params';
import { tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import withUser, { type UserProps } from '@shared/hooks/with-user';
import { setShowZendesk } from '@shared/store/ui';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils/i18n';
import { isServerSideRendering } from '@shared/utils/is-browser';
import { VisitorLayout } from '@visitor-layout/index';
import ErrorNoAccess from '../../modules/shared/components/ErrorNoAccess/ErrorNoAccess';

const { publicRuntimeConfig } = getConfig();

const DynamicRouteResolver: NextPage<DefaultSeoInfo & UserProps> = ({
	title,
	description,
	image,
	url,
	commonUser,
}) => {
	const router = useRouter();
	const locale = useLocale();

	/**
	 * slug can contain multiple things
	 * * content page path (array of path segments or single string)
	 * * ie object schema identifier
	 */
	const contentPageSlugOrObjectSchemaIdentifier = getSlugFromQueryParams(router.query);
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
	} = useGetContentPageByLanguageAndPath(locale, `/${contentPageSlugOrObjectSchemaIdentifier}`);
	const contentPageInfo = dbContentPage
		? convertDbContentPageToContentPageInfo(dbContentPage)
		: null;

	const { isLoading: isIeObjectLoading, data: ieObjectInfo } = useGetIeObjectInfo(
		contentPageSlugOrObjectSchemaIdentifier as string
	);

	/**
	 * Computed
	 */
	const isContentPageNotFoundError = (contentPageError as HTTPError)?.response?.status === 404;

	/**
	 * Effects
	 */

	useEffect(() => {
		if (isContentPageNotFoundError && !isIeObjectLoading && !ieObjectInfo) {
			window.open(`${publicRuntimeConfig.PROXY_URL}/not-found`, '_self');
		}
	}, [ieObjectInfo, isContentPageNotFoundError, isIeObjectLoading]);

	useEffect(() => {
		if (ieObjectInfo) {
			const objectDetailPagePath = `${ROUTES_BY_LOCALE[locale].search}/${
				ieObjectInfo.maintainerSlug
			}/${ieObjectInfo.schemaIdentifier}/${kebabCase(ieObjectInfo.name)}`;
			router.replace(objectDetailPagePath);
		}
	}, [ieObjectInfo, locale, router]);

	useEffect(() => {
		dispatch(setShowZendesk(!isKioskUser));
	}, [dispatch, isKioskUser]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isContentPageLoading || isIeObjectLoading || (isContentPageFetching && !contentPageInfo)) {
			return <Loading fullscreen owner={'/[slug]/index page'} />;
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

		if (!contentPageInfo && !ieObjectInfo) {
			if (isServerSideRendering()) {
				// Avoid loading a 404 page in SSR
				// since we don't want to see a 404 error flash before the page loads for logged-in users
				// https://meemoo.atlassian.net/browse/ARC-2857
				return <Loading fullscreen owner={'/[slug]/index page'} />;
			}
			return (
				<>
					<SeoTags
						title={tText('pages/404___niet-gevonden')}
						description={tText('pages/404___pagina-niet-gevonden')}
						imgUrl={undefined}
						translatedPages={[]}
						relativeUrl={url}
					/>
					<ErrorNotFound />
				</>
			);
		}
	};

	return <VisitorLayout>{renderPageContent()}</VisitorLayout>;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	let title: string | null = null;
	let description: string | null = null;
	let image: string | null = null;
	const pathOrIeObjectId = context.query.slug as string;
	const locale = (context.locale || Locale.nl) as Locale;

	if (pathOrIeObjectId) {
		try {
			const contentPage = await ContentPageClientService.getByLanguageAndPath(
				locale,
				`/${pathOrIeObjectId}`
			);
			title = contentPage?.title || null;
			description = contentPage?.seoDescription || contentPage?.description || null;
			image = contentPage?.thumbnailPath || null;
		} catch (err) {
			console.error(`Failed to fetch content page seo info by slug: ${pathOrIeObjectId}`, err);
		}
	} else {
		title = 'Home - Het Archief';
	}

	const queryClient = new QueryClient();
	await Promise.all([
		makeServerSideRequestGetContentPageByLanguageAndPath(
			queryClient,
			pathOrIeObjectId ? `/${pathOrIeObjectId}` : undefined,
			locale
		),
		makeServerSideRequestGetIeObjectInfo(queryClient, pathOrIeObjectId),
		makeServerSideRequestGetIeObjectThumbnail(queryClient, pathOrIeObjectId),
	]);

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
