import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import { IeObjectWithoutObjectNamePage } from '@search/IeObjectWithoutObjectNamePage';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

/**
 * Redirect page for urls of the form: /zoeken/:maintainerSlug/:ieObjectId => redirects to: /zoeken/:maintainerSlug/:ieObjectId/:ieObjectName
 * @constructor
 */
const IeObjectWithoutObjectNamePageDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <IeObjectWithoutObjectNamePage url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default IeObjectWithoutObjectNamePageDutch;
