import { type GetServerSidePropsResult, type NextPage } from 'next';
import { type GetServerSidePropsContext } from 'next/types';

import { IeObjectWithoutObjectNamePage } from '@ie-objects/IeObjectWithoutObjectNamePage';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

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
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default IeObjectWithoutObjectNamePageDutch;
