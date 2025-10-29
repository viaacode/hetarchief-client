import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';

import { IeObjectWithoutObjectNamePage } from '@ie-objects/IeObjectWithoutObjectNamePage';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

/**
 * Redirect page for urls of the form: /zoeken/:maintainerSlug/:ieObjectId => redirects to: /zoeken/:maintainerSlug/:ieObjectId/:ieObjectName
 * @constructor
 */
const IeObjectWithoutObjectNamePageDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <IeObjectWithoutObjectNamePage url={url} locale={locale} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const schemaIdentifier = context.query.ie as string;
	return getDefaultStaticProps(context, context.resolvedUrl, { schemaIdentifier });
}

export default IeObjectWithoutObjectNamePageDutch;
