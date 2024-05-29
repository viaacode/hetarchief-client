import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React from 'react';

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
	let seoInfo: SeoInfo | null = null;
	try {
		seoInfo = await IeObjectsService.getSeoById(context.query.ie as string);
	} catch (err) {
		console.error('Failed to fetch media info by id: ' + context.query.ie, err);
	}

	return getDefaultStaticProps(
		context,
		undefined,
		seoInfo?.name,
		seoInfo?.description,
		seoInfo?.thumbnailUrl
	);
}

export default ObjectDetailPageEnglish;
