import { ContentPageRenderer, convertDbContentPageToContentPageInfo } from '@meemoo/admin-core-ui';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { kebabCase } from 'lodash-es';
import { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, FC, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { GroupName } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import { getIeObjectInfo, useGetIeObjectInfo } from '@ie-objects/hooks/get-ie-objects-info';
import {
	getContentPageByLanguageAndPath,
	useGetContentPageByLanguageAndPath,
} from '@modules/content-page/hooks/get-content-page';
import { ContentPageClientService } from '@modules/content-page/services/content-page-client.service';
import { VisitorLayout } from '@modules/visitor-layout';
import { ErrorNotFound, Loading } from '@shared/components';
import { QUERY_KEYS, ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { setShowZendesk } from '@shared/store/ui';
import { DefaultSeoInfo } from '@shared/types/seo';
import { isBrowser, Locale } from '@shared/utils';

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
			window.open(
				`${isBrowser() ? publicRuntimeConfig.PROXY_URL : process.env.PROXY_URL}/not-found`,
				'_self'
			);
		}
	}, [ieObjectInfo, isContentPageNotFoundError, isIeObjectLoading]);

	useEffect(() => {
		if (ieObjectInfo) {
			const objectDetailPagePath = `${ROUTES_BY_LOCALE[locale].search}/${
				ieObjectInfo.maintainerSlug
			}/${ieObjectInfo.schemaIdentifier}/${kebabCase(ieObjectInfo.name)}`;
			window.open(objectDetailPagePath, '_self');
		}
	}, [ieObjectInfo, locale]);

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
					{renderOgTags(
						title,
						description ||
							contentPageInfo?.seoDescription ||
							contentPageInfo?.description ||
							null,
						url,
						image || contentPageInfo?.thumbnailPath || null,
						false
					)}
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
					{renderOgTags(
						tText('pages/404___niet-gevonden'),
						tText('pages/404___pagina-niet-gevonden'),
						url,
						null
					)}
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
			console.error(
				'Failed to fetch content page seo info by slug: ' + pathOrIeObjectId,
				err
			);
		}
	} else {
		title = 'Home - Het Archief';
	}

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getContentPage, { path: `/${pathOrIeObjectId}`, language: locale }],
		queryFn: () => getContentPageByLanguageAndPath(locale, `/${pathOrIeObjectId}`),
	});
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getIeObjectsInfo, { id: pathOrIeObjectId }],
		queryFn: () => getIeObjectInfo(pathOrIeObjectId),
	});
	const dehydratedState = dehydrate(queryClient);

	return getDefaultStaticProps(context, dehydratedState, title, description, image);
}

export default withUser(
	withAuth(DynamicRouteResolver as ComponentType, false)
) as FC<DefaultSeoInfo>;
