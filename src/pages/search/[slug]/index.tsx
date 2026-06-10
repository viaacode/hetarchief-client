import { getMaintainerSearchPageServerSideProps } from '@search/get-maintainer-search-page-ssr-props';
import { MaintainerSearchPage } from '@search/MaintainerSearchPage';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';

const MaintainerSearchPageEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <MaintainerSearchPage url={url} locale={locale} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getMaintainerSearchPageServerSideProps(context);
}

export default MaintainerSearchPageEnglish;
