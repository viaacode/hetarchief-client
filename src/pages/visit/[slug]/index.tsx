import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import type { ComponentType } from 'react';

import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { VisitorSpaceService } from '@visitor-space/services';
import type { VisitorSpaceInfo } from '@visitor-space/types';
import { VisitPage } from '@visitor-space/views/VisitPage';

const VisitPageEnglish: NextPage<DefaultSeoInfo> = (seo) => {
	return <VisitPage {...seo} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	let space: VisitorSpaceInfo | null = null;
	try {
		space = await VisitorSpaceService.getBySlug(context.query.slug as string, true);
	} catch (err) {
		console.error(`Failed to fetch media info by id: ${context.query.ie}`, err);
	}

	return getDefaultStaticProps(context, context.resolvedUrl, {
		title: space?.name || null,
		description: space?.info || null,
	});
}

export default VisitPageEnglish as ComponentType;
