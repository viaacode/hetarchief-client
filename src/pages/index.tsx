import { GroupName } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	getContentPageByLanguageAndPath,
	useGetContentPageByLanguageAndPath,
} from '@content-page/hooks/get-content-page';
import {
	ContentPageRenderer,
	convertDbContentPageToContentPageInfo,
} from '@meemoo/admin-core-ui/admin';
import { Loading } from '@shared/components/Loading';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { KNOWN_STATIC_ROUTES, QUERY_KEYS, ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import withUser, { type UserProps } from '@shared/hooks/with-user';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { Locale } from '@shared/utils/i18n';
import { QueryClient } from '@tanstack/react-query';
import { VisitorLayout } from '@visitor-layout/index';
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { type ComponentType, type FC, useEffect } from 'react';
import ErrorNoAccess from '../modules/shared/components/ErrorNoAccess/ErrorNoAccess';

const { publicRuntimeConfig } = getConfig();

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
				<ContentPageRenderer
					contentPageInfo={contentPageInfo}
					commonUser={commonUser}
					renderNoAccessError={() => <ErrorNoAccess visitorSpaceSlug={null} />}
				/>
			);
		}
	};

	return (
		<VisitorLayout>
			<SeoTags
				title={title || null}
				description={
					description || contentPageInfo?.seoDescription || contentPageInfo?.description || null
				}
				imgUrl={image || contentPageInfo?.thumbnailPath || null}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={publicRuntimeConfig.CLIENT_URL}
			/>
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

	const language = (context.locale || Locale.nl) as Locale;
	const path = KNOWN_STATIC_ROUTES[language].Home;
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEYS.getContentPage, path, language],
		queryFn: () => getContentPageByLanguageAndPath(language, path),
	});

	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.home, {
		queryClient,
		title,
		description,
		image,
	});
}

export default withUser(withAuth(Homepage as ComponentType, false)) as FC<DefaultSeoInfo>;
