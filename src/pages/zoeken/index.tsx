import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { makeServerSideRequestGetIeObjects } from '@ie-objects/hooks/get-ie-objects';
import SearchPage from '@search/SearchPage';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

type SearchPageProps = DefaultSeoInfo;

const SearchPageDutch: NextPage<SearchPageProps> = ({ url, title, description, image }) => {
	return <SearchPage url={url} title={title} description={description} image={image} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const queryClient = new QueryClient();
	await makeServerSideRequestGetIeObjects(queryClient);
	const dehydratedState = dehydrate(queryClient);

	return getDefaultStaticProps(context, dehydratedState);
}

export default withAuth(SearchPageDutch as ComponentType, false);
