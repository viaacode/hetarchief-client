import { type GetServerSidePropsResult, type NextPage } from 'next';
import { type GetServerSidePropsContext } from 'next/types';

import { MaintainerSearchPage } from '@search/MaintainerSearchPage';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const MaintainerSearchPageDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <MaintainerSearchPage url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default MaintainerSearchPageDutch;
