import { QueryClient } from '@tanstack/react-query';
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import type { ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { makeServerSideRequestGetIeObjectFormatCounts } from '@ie-objects/hooks/use-get-ie-object-format-counts';
import { makeServerSideRequestGetIeObjects } from '@ie-objects/hooks/use-get-ie-objects';
import SearchPage from '@search/SearchPage';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { makeServerSideRequestGetVisitRequests } from '@visit-requests/hooks/get-visit-requests';

type SearchPageProps = DefaultSeoInfo;

const SearchPageEnglish: NextPage<SearchPageProps> = ({
	url,
	title,
	description,
	image,
	locale,
}) => {
	return (
		<SearchPage
			url={url}
			title={title}
			description={description}
			image={image}
			locale={locale}
			canonicalUrl="https://hetarchief.be/zoeken"
		/>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const queryClient = new QueryClient();
	await makeServerSideRequestGetIeObjects(queryClient);
	await makeServerSideRequestGetIeObjectFormatCounts(queryClient);
	await makeServerSideRequestGetVisitRequests(queryClient, {
		page: 0,
		size: 20,
	});

	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.search, {
		queryClient,
	});
}

export default withAuth(SearchPageEnglish as ComponentType, false);
