import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';

import { ErrorNotFound } from '@shared/components';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { tText } from '@shared/helpers/translate';
import useHideNavigationHeaderRight from '@shared/hooks/use-hide-navigation-header-right/use-hide-navigation-header-right';
import { DefaultSeoInfo } from '@shared/types/seo';

import useHideFooter from '../modules/shared/hooks/use-hide-footer/use-hide-footer';

const NotFound: NextPage<DefaultSeoInfo> = ({ url }) => {
	useHideFooter();
	useHideNavigationHeaderRight();

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
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, undefined, ROUTES_BY_LOCALE.nl.notFound);
}

export default NotFound;
