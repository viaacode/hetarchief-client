import type { NextPage } from 'next';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types';
import React from 'react';

import { ObjectDetailPage } from '@ie-objects/ObjectDetailPage';
import { prefetchDetailPageQueries } from '@ie-objects/ObjectDetailPage.helpers';
import type { IeObject } from '@ie-objects/ie-objects.types';
import { IeObjectsService } from '@ie-objects/services';
import type { SeoInfo } from '@ie-objects/services/ie-objects/ie-objects.service.types';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

type ObjectDetailPageProps = {
	title: string | null;
	description: string | null;
} & DefaultSeoInfo;

const ObjectDetailPageDutch: NextPage<ObjectDetailPageProps> = ({
	title,
	description,
	image,
	url,
	locale,
}) => {
	return (
		<ObjectDetailPage
			title={title}
			description={description}
			image={image}
			url={url}
			locale={locale}
		/>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const schemaIdentifier = context.query.ie as string;

	let ieObject: IeObject | null = null;
	try {
		ieObject = (await IeObjectsService.getBySchemaIdentifiers([schemaIdentifier]))?.[0];
	} catch (err) {
		// TODO see what we should do with objects that are not publicly available during server side rendering
	}

	let seoInfo: SeoInfo | null = null;
	try {
		seoInfo = await IeObjectsService.getSeoBySchemaIdentifier(schemaIdentifier);
	} catch (err) {
		console.error(`Failed to fetch media info by id: ${context.query.ie}`, err);
	}

	return getDefaultStaticProps(context, context.resolvedUrl, {
		queryClient: await prefetchDetailPageQueries(
			schemaIdentifier,
			ieObject?.maintainerId,
			ieObject?.maintainerSlug
		),
		title: seoInfo?.name,
		description: seoInfo?.description,
		image: seoInfo?.thumbnailUrl,
	});
}

export default ObjectDetailPageDutch;
