import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';

import { MaintainerSearchPage } from '@search/MaintainerSearchPage';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const MaintainerSearchPageEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <MaintainerSearchPage url={url} locale={locale} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default MaintainerSearchPageEnglish;
