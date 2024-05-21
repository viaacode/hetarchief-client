import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

import SearchPage from '@modules/search/SearchPage';

type SearchPageProps = DefaultSeoInfo;

const SearchPageEnglish: NextPage<SearchPageProps> = ({ url }) => {
	return <SearchPage url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(SearchPageEnglish as ComponentType, false);
