import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';

import { ErrorNotFound } from '@shared/components';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { tText } from '@shared/helpers/translate';
import useHideNavigationHeaderRight from '@shared/hooks/use-hide-navigation-header-right/use-hide-navigation-header-right';
import { DefaultSeoInfo } from '@shared/types/seo';

import useHideFooter from '../modules/shared/hooks/use-hide-footer/use-hide-footer';

const NotFound: NextPage<DefaultSeoInfo> = ({ url }) => {
	useHideFooter();
	useHideNavigationHeaderRight();

	console.log('rendering not found', { title: tText('pages/404___niet-gevonden') });
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
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default NotFound;
