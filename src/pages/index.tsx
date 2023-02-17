import { ContentPageRenderer } from '@meemoo/admin-core-ui';
import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BooleanParam, useQueryParams } from 'use-query-params';

import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { AuthModal } from '@auth/components';
import { selectUser } from '@auth/store/user';
import { SHOW_AUTH_QUERY_KEY } from '@home/const';
import { Loading } from '@shared/components';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { selectShowAuthModal, setShowAuthModal } from '@shared/store/ui';
import { DefaultSeoInfo } from '@shared/types/seo';

import { useGetContentPageByPath } from '../modules/content-page/hooks/get-content-page';
import { ContentPageClientService } from '../modules/content-page/services/content-page-client.service';

import { VisitorLayout } from 'modules/visitors';

type HomepageProps = {
	title: string | null;
} & DefaultSeoInfo;

const Homepage: NextPage<HomepageProps> = ({ title, url }) => {
	const user = useSelector(selectUser);
	const dispatch = useDispatch();
	const showAuthModal = useSelector(selectShowAuthModal);
	const [query, setQuery] = useQueryParams({
		[SHOW_AUTH_QUERY_KEY]: BooleanParam,
	});

	/**
	 * Data
	 */

	const { isLoading: isContentPageLoading, data: contentPageInfo } = useGetContentPageByPath('/');

	useEffect(() => {
		if (typeof query.showAuth === 'boolean') {
			dispatch(setShowAuthModal(query.showAuth));
		}
	}, [dispatch, query.showAuth]);

	/**
	 * Methods
	 */

	const onCloseAuthModal = () => {
		if (typeof query[SHOW_AUTH_QUERY_KEY] === 'boolean') {
			setQuery({
				[SHOW_AUTH_QUERY_KEY]: undefined,
			});
		}
		dispatch(setShowAuthModal(false));
	};

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isContentPageLoading) {
			return <Loading fullscreen owner="homepage" />;
		}
		if (contentPageInfo) {
			return <ContentPageRenderer contentPageInfo={contentPageInfo} />;
		}
	};

	return (
		<VisitorLayout>
			{renderOgTags(title || undefined, '', url)}
			{renderPageContent()}
			<AuthModal isOpen={showAuthModal && !user} onClose={onCloseAuthModal} />
		</VisitorLayout>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<HomepageProps>> {
	let title: string | null = null;
	try {
		const contentPage = await ContentPageClientService.getBySlug('/');
		title = contentPage?.title || null;
	} catch (err) {
		console.error('Failed to fetch content page seo info by slug: ' + context.query.slug, err);
	}

	const defaultProps: GetServerSidePropsResult<DefaultSeoInfo> = await getDefaultServerSideProps(
		context
	);

	return {
		props: { ...(defaultProps as { props: DefaultSeoInfo }).props, title },
	};
}

export default withAdminCoreConfig(Homepage as ComponentType);
