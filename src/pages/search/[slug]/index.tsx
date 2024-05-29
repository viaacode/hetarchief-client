import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import { MaintainerSearchPage } from '@modules/search/MaintainerSearchPage';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const MaintainerSearchPageEnglish: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <MaintainerSearchPage url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default MaintainerSearchPageEnglish;
