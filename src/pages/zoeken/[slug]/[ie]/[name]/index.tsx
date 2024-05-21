import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React from 'react';

import { IeObjectsService } from '@ie-objects/services';
import { SeoInfo } from '@ie-objects/services/ie-objects/ie-objects.service.types';
import { ObjectDetailPage } from '@modules/search/ObjectDetailPage';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

type ObjectDetailPageProps = {
	title: string | null;
	description: string | null;
} & DefaultSeoInfo;

const ObjectDetailPageDutch: NextPage<ObjectDetailPageProps> = ({ title, description, url }) => {
	return <ObjectDetailPage title={title} description={description} url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ObjectDetailPageProps>> {
	let seoInfo: SeoInfo | null = null;
	try {
		seoInfo = await IeObjectsService.getSeoById(context.query.ie as string);
	} catch (err) {
		console.error('Failed to fetch media info by id: ' + context.query.ie, err);
	}

	const defaultProps: GetServerSidePropsResult<DefaultSeoInfo> =
		await getDefaultStaticProps(context);

	return {
		props: {
			...(defaultProps as { props: DefaultSeoInfo }).props,
			title: seoInfo?.name || null,
			description: seoInfo?.description || null,
		},
	};
}

export default ObjectDetailPageDutch;
