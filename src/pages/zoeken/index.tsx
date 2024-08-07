import { QueryClient } from '@tanstack/react-query';
import { type GetServerSidePropsContext, type GetServerSidePropsResult, type NextPage } from 'next';
import { type ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { makeServerSideRequestGetIeObjects } from '@ie-objects/hooks/get-ie-objects';
import SearchPage from '@search/SearchPage';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

type SearchPageProps = DefaultSeoInfo;

const SearchPageDutch: NextPage<SearchPageProps> = ({ url, title, description, image }) => {
	return <SearchPage url={url} title={title} description={description} image={image} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const queryClient = new QueryClient();
	await makeServerSideRequestGetIeObjects(queryClient);

	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.search, { queryClient });
}

export default withAuth(SearchPageDutch as ComponentType, false);
