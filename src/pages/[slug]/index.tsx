import {
	ContentPageRenderer,
	convertDbContentPageToContentPageInfo,
} from '@meemoo/admin-core-ui/dist/admin.mjs';
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
import {
	makeServerSideRequestGetIeObjectInfo,
	useGetIeObjectInfo,
} from '@ie-objects/hooks/get-ie-objects-info';
import { ErrorNotFound } from '@shared/components/ErrorNotFound';
import { Loading } from '@shared/components/Loading';
import { type PageInfo, SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import withUser, { type UserProps } from '@shared/hooks/with-user';
import { setShowZendesk } from '@shared/store/ui';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils/i18n';
import { VisitorLayout } from '@visitor-layout/index';

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
	const { slug } = router.query;
	const dispatch = useDispatch();
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);

	/**
	 * Data
	 */
	const {
		error: contentPageError,
		isLoading: isContentPageLoading,
		data: dbContentPage,
	} = useGetContentPageByLanguageAndPath(locale, `/${slug}`);
	const contentPageInfo = dbContentPage
		? convertDbContentPageToContentPageInfo(dbContentPage)
		: null;

	const { isLoading: isIeObjectLoading, data: ieObjectInfo } = useGetIeObjectInfo(slug as string);

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
		if (isContentPageLoading || isIeObjectLoading) {
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
					/>
				</>
			);
		}

		if (!contentPageInfo && !ieObjectInfo) {
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
