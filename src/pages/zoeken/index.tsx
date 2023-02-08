import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { setShowZendesk } from '@shared/store/ui';
import { DefaultSeoInfo } from '@shared/types/seo';
import { VisitorSpaceSearchPage } from '@visitor-space/components';

type SearchPageProps = DefaultSeoInfo;

const SearchPage: NextPage<SearchPageProps> = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setShowZendesk(false));
	}, [dispatch]);

	const renderPageContent = () => {
		return <VisitorSpaceSearchPage />;
	};

	return renderPageContent();
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default SearchPage;
