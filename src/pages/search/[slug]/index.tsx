import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

import { MaintainerSearchPage } from '@modules/search/MaintainerSearchPage';

const MaintainerSearchPageEnglish: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <MaintainerSearchPage url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default MaintainerSearchPageEnglish;
