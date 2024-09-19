import { type GetServerSidePropsResult, type NextPage } from 'next';
import { type GetServerSidePropsContext } from 'next/types';
import { type ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { VisitorSpaceService } from '@visitor-space/services';
import { type VisitorSpaceInfo } from '@visitor-space/types';
import { VisitRequestedPage } from '@visitor-space/views/VisitRequestedPage';

const VisitRequestedPageEnglish: NextPage<DefaultSeoInfo> = ({
	title,
	description,
	url,
	locale,
}) => {
	return <VisitRequestedPage title={title} description={description} url={url} locale={locale} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	let space: VisitorSpaceInfo | null = null;
	try {
		space = await VisitorSpaceService.getBySlug(context.query.slug as string, true);
	} catch (err) {
		console.error('Failed to fetch media info by id: ' + context.query.ie, err);
	}

	return getDefaultStaticProps(context, context.resolvedUrl, {
		title: space?.name || null,
		description: space?.info || null,
	});
}

export default withAuth(VisitRequestedPageEnglish as ComponentType, true);
