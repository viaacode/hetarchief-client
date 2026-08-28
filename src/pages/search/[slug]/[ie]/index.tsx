import { getIeObjectDetailPageServerSideProps } from '@ie-objects/get-ie-object-detail-page-ssr-props';
import { IeObjectWithoutObjectNamePage } from '@ie-objects/IeObjectWithoutObjectNamePage';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';

/**
 * Redirect page for urls of the form: /zoeken/:maintainerSlug/:ieObjectId
 * => redirects to: /zoeken/:maintainerSlug/:ieObjectId/:ieObjectName
 *
 * The redirect happens server side as a 301 whenever the object can be resolved, so that search
 * engines never index this url. Objects that cannot be resolved server side (eg private objects
 * that return a 403) fall back to the client side redirect below.
 * @constructor
 */
const IeObjectWithoutObjectNamePageEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <IeObjectWithoutObjectNamePage url={url} locale={locale} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getIeObjectDetailPageServerSideProps(context);
}

export default IeObjectWithoutObjectNamePageEnglish;
