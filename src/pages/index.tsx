import { ContentPageRenderer } from '@meemoo/admin-core-ui';
import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BooleanParam, useQueryParams } from 'use-query-params';

import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { AuthModal } from '@auth/components';
import { selectUser } from '@auth/store/user';
import { SHOW_AUTH_QUERY_KEY } from '@home/const';
import { Loading } from '@shared/components';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { selectShowAuthModal, setShowAuthModal } from '@shared/store/ui';
import { DefaultSeoInfo } from '@shared/types/seo';

import { useGetContentPage } from '../modules/content-page/hooks/get-content-page';
import { ContentPageService } from '../modules/content-page/services/content-page.service';

import { VisitorLayout } from 'modules/visitors';

type HomepageProps = {
	title: string | null;
} & DefaultSeoInfo;

const Homepage: NextPage<HomepageProps> = ({ title, url }) => {
	useNavigationBorder();

	const router = useRouter();
	const user = useSelector(selectUser);
	const { slug } = router.query;
	const dispatch = useDispatch();
	const showAuthModal = useSelector(selectShowAuthModal);
	const [query, setQuery] = useQueryParams({
		[SHOW_AUTH_QUERY_KEY]: BooleanParam,
	});

	/**
	 * Data
	 */

	const { isLoading: isContentPageLoading, data: contentPageInfo } = useGetContentPage(
		slug as string,
		true
	);

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
			return <Loading fullscreen owner="slug page: render page content" />;
		}
		if (contentPageInfo) {
			return <ContentPageRenderer path={'/' as string} userGroupId={user?.groupId} />;
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
		const [contentPage] = await Promise.allSettled([
			ContentPageService.getBySlug(('/' + context.query.slug) as string),
		]);

		if (contentPage.status === 'fulfilled') {
			title = contentPage.value?.title || null;
		}
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
