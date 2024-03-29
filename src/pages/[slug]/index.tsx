import { ContentPageRenderer } from '@meemoo/admin-core-ui';
import { HTTPError } from 'ky';
import { kebabCase } from 'lodash-es';
import { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { GroupName } from '@account/const';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { useGetIeObjectsInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { ErrorNotFound, Loading } from '@shared/components';
import { ROUTE_PARTS } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { setShowZendesk } from '@shared/store/ui';
import { DefaultSeoInfo } from '@shared/types/seo';
import { isBrowser } from '@shared/utils';

import { useGetContentPageByPath } from '../../modules/content-page/hooks/get-content-page';
import { ContentPageClientService } from '../../modules/content-page/services/content-page-client.service';

import { VisitorLayout } from 'modules/visitors';

const { publicRuntimeConfig } = getConfig();

type DynamicRouteResolverProps = {
	title: string | null;
	description: string | null;
	image: string | null;
} & DefaultSeoInfo;

const DynamicRouteResolver: NextPage<DynamicRouteResolverProps & UserProps> = ({
	title,
	description,
	image,
	url,
	commonUser,
}) => {
	const router = useRouter();
	const { slug } = router.query;
	const dispatch = useDispatch();
	const isKioskUser = useHasAnyGroup(GroupName.KIOSK_VISITOR);

	/**
	 * Data
	 */

	const {
		error: contentPageError,
		isLoading: isContentPageLoading,
		data: contentPageInfo,
	} = useGetContentPageByPath(`/${slug}`);
	const { isLoading: isIeObjectLoading, data: ieObjectInfo } = useGetIeObjectsInfo(
		slug as string,
		{ enabled: !!slug }
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
			window.open(
				`${isBrowser() ? publicRuntimeConfig.PROXY_URL : process.env.PROXY_URL}/not-found`,
				'_self'
			);
		}
	}, [ieObjectInfo, isContentPageNotFoundError, isIeObjectLoading]);

	useEffect(() => {
		if (ieObjectInfo) {
			const objectDetailPagePath = `/${ROUTE_PARTS.search}/${ieObjectInfo.maintainerSlug}/${
				ieObjectInfo.schemaIdentifier
			}/${kebabCase(ieObjectInfo.name)}`;
			window.open(objectDetailPagePath, '_self');
		}
	}, [ieObjectInfo]);

	useEffect(() => {
		dispatch(setShowZendesk(!isKioskUser));
	}, [dispatch, isKioskUser]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (contentPageInfo) {
			return (
				<ContentPageRenderer
					contentPageInfo={contentPageInfo}
					commonUser={commonUser}
					key={contentPageInfo.path}
				/>
			);
		}

		if (!isContentPageLoading && !contentPageInfo && !isIeObjectLoading && !ieObjectInfo) {
			return <ErrorNotFound />;
		}

		return <Loading fullscreen owner="/[slug]/index page" />;
	};

	return (
		<VisitorLayout>
			{renderOgTags(
				title,
				description ||
					contentPageInfo?.seoDescription ||
					contentPageInfo?.description ||
					null,
				url,
				undefined,
				image || contentPageInfo?.thumbnailPath || null
			)}
			{renderPageContent()}
		</VisitorLayout>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DynamicRouteResolverProps>> {
	let title: string | null = null;
	let description: string | null = null;
	let image: string | null = null;
	const slug = context.query.slug;
	if (slug) {
		try {
			const contentPage = await ContentPageClientService.getBySlug(`/${context.query.slug}`);
			title = contentPage?.title || null;
			description = contentPage?.seoDescription || contentPage?.description || null;
			image = contentPage?.thumbnailPath || null;
		} catch (err) {
			console.error(
				'Failed to fetch content page seo info by slug: ' + context.query.slug,
				err
			);
		}
	} else {
		title = 'Home - Het Archief';
	}

	const defaultProps: GetServerSidePropsResult<DefaultSeoInfo> =
		await getDefaultServerSideProps(context);

	return {
		props: { ...(defaultProps as { props: DefaultSeoInfo }).props, title, description, image },
	};
}

export default withAdminCoreConfig(
	withUser(withAuth(DynamicRouteResolver as ComponentType, false)) as any
) as FC<DefaultSeoInfo>;
