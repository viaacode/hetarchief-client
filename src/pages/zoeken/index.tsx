import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { ComponentType, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { tText } from '@shared/helpers/translate';
import { setBreadcrumbs } from '@shared/store/ui';
import { DefaultSeoInfo } from '@shared/types/seo';
import { SearchPage } from '@visitor-space/components';

type SearchPageProps = DefaultSeoInfo;

const Search: NextPage<SearchPageProps> = ({ url }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(
			setBreadcrumbs([
				{
					label: `${tText('pages/slug/ie/index___breadcrumbs___home')}`,
					to: ROUTES.home,
				},
				{
					label: `${tText('pages/slug/ie/index___breadcrumbs___search')}`,
					to: ROUTES.search,
				},
			])
		);
	}, [dispatch]);

	const renderPageContent = () => {
		return <SearchPage />;
	};

	return (
		<>
			{renderOgTags(
				tText('pages/zoeken/index___zoeken-pagina-titel'),
				tText('pages/zoeken/index___zoek-pagina-seo-omschrijving'),
				url
			)}
			{renderPageContent()}
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(Search as ComponentType, false);
