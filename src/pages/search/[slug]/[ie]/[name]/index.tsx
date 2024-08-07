import { type GetServerSidePropsResult, type NextPage } from 'next';
import { type GetServerSidePropsContext } from 'next/types';
import React from 'react';

import { ObjectDetailPage } from '@ie-objects/ObjectDetailPage';
import { prefetchDetailPageQueries } from '@ie-objects/ObjectDetailPage.helpers';
import { getIeObjectInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { IeObjectsService } from '@ie-objects/services';
import { type SeoInfo } from '@ie-objects/services/ie-objects/ie-objects.service.types';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const ObjectDetailPageEnglish: NextPage<DefaultSeoInfo> = ({ title, description, image, url }) => {
	return <ObjectDetailPage title={title} description={description} image={image} url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const ieObjectId = context.query.ie as string;

	const ieObject = await getIeObjectInfo(ieObjectId);

	let seoInfo: SeoInfo | null = null;
	try {
		seoInfo = await IeObjectsService.getSeoById(ieObjectId);
	} catch (err) {
		console.error('Failed to fetch media info by id: ' + context.query.ie, err);
	}

	return getDefaultStaticProps(context, context.resolvedUrl, {
		queryClient: await prefetchDetailPageQueries(
			ieObjectId,
			ieObject?.meemooIdentifier,
			ieObject?.maintainerId,
			ieObject?.maintainerSlug
		),
		title: seoInfo?.name,
		description: seoInfo?.description,
		image: seoInfo?.thumbnailUrl,
	});
}

export default ObjectDetailPageEnglish;
