import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { makeServerSideRequestGetIeObjectFormatCounts } from '@ie-objects/hooks/get-ie-object-format-counts';
import { makeServerSideRequestGetIeObjects } from '@ie-objects/hooks/get-ie-objects';
import SearchPage from '@search/SearchPage';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

type SearchPageProps = DefaultSeoInfo;

const SearchPageEnglish: NextPage<SearchPageProps> = ({
	url,
	title,
	description,
	image,
	dehydratedState,
}) => {
	return (
		<SearchPage
			url={url}
			title={title}
			description={description}
			image={image}
			dehydratedState={dehydratedState}
		/>
	);
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const queryClient = new QueryClient();
	await makeServerSideRequestGetIeObjects(queryClient);
	await makeServerSideRequestGetIeObjectFormatCounts(queryClient);
	const dehydratedState = dehydrate(queryClient);

	return getDefaultStaticProps(context, dehydratedState);
}

export default withAuth(SearchPageEnglish as ComponentType, false);
