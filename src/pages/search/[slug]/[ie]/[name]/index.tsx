import type { IeObject } from '@ie-objects/ie-objects.types';
import { ObjectDetailPage } from '@ie-objects/ObjectDetailPage';
import { prefetchDetailPageQueries } from '@ie-objects/ObjectDetailPage.helpers';
import { IeObjectsService } from '@ie-objects/services';
import type { IeObjectSeo } from '@ie-objects/services/ie-objects/ie-objects.service.types';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import React from 'react';

const ObjectDetailPageEnglish: NextPage<DefaultSeoInfo> = ({
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
	let showHard404IfNotFound = true;
	try {
		ieObject = (await IeObjectsService.getBySchemaIdentifiers([schemaIdentifier]))?.[0];
		// biome-ignore lint/suspicious/noExplicitAny: unknown error
	} catch (err: any) {
		if (err?.response?.status === 403) {
			// https://meemoo.atlassian.net/browse/ARC-3299
			// Do not throw a hard 404 when the object is not publicly accessible, since users still want to visit that page
			showHard404IfNotFound = false;
		}
	}

	if (!ieObject && showHard404IfNotFound) {
		return { notFound: true };
	}

	let seoInfo: IeObjectSeo | null = null;
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
		schemaIdentifier,
		title: seoInfo?.name,
		description: seoInfo?.description,
		image: seoInfo?.thumbnailUrl,
	});
}

export default ObjectDetailPageEnglish;
