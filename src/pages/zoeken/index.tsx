import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { ComponentType, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { setShowZendesk } from '@shared/store/ui';
import { DefaultSeoInfo } from '@shared/types/seo';
import VisitorSpaceSearchPage from '@visitor-space/components/VisitorSpaceSearchPage/VisitorSpaceSearchPage';

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
