import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React from 'react';

import { makeServerSideRequestGetIeObjectInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { IeObjectsService } from '@ie-objects/services';
import { SeoInfo } from '@ie-objects/services/ie-objects/ie-objects.service.types';
import { ObjectDetailPage } from '@modules/search/ObjectDetailPage';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const ObjectDetailPageEnglish: NextPage<DefaultSeoInfo> = ({ title, description, image, url }) => {
	return <ObjectDetailPage title={title} description={description} image={image} url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const ieObjectId = context.query.ie as string;

	let seoInfo: SeoInfo | null = null;
	try {
		seoInfo = await IeObjectsService.getSeoById(ieObjectId);
	} catch (err) {
		console.error('Failed to fetch media info by id: ' + context.query.ie, err);
	}

	const queryClient = new QueryClient();
	await makeServerSideRequestGetIeObjectInfo(queryClient, ieObjectId);
	await makeServerSideRequestGetIeObjectsRelated(queryClient);
	await makeServerSideRequestGetIeObjectsSimilar(queryClient);
	await makeServerSideRequestGetIeObjectsTicketInfo(queryClient);
	await makeServerSideRequestGetActiveVisitForUserAndSpace(queryClient);
	await makeServerSideRequestGetAccessibleVisitorSpaces(queryClient);
	await makeServerSideRequestGetPeakFile(queryClient);
	await makeServerSideRequestGetVisitorSpace(queryClient);
	const dehydratedState = dehydrate(queryClient);

	return getDefaultStaticProps(
		context,
		dehydratedState,
		seoInfo?.name,
		seoInfo?.description,
		seoInfo?.thumbnailUrl
	);
}

export default ObjectDetailPageEnglish;
