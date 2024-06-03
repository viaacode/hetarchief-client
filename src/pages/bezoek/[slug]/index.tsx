import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType } from 'react';

import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';
import { VisitorSpaceService } from '@visitor-space/services';
import { VisitorSpaceInfo } from '@visitor-space/types';
import { VisitPage } from '@visitor-space/views/VisitPage';

const VisitPageDutch: NextPage<DefaultSeoInfo> = (seo) => {
	return <VisitPage {...seo} />;
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

	return getDefaultStaticProps(
		context,
		undefined,
		context.resolvedUrl,
		space?.name || null,
		space?.info || null,
		null
	);
}

export default VisitPageDutch as ComponentType;
