import { MIN_LENGTH_SCHEMA_IDENTIFIER_V2 } from '@ie-objects/ie-objects.consts';
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
	let newSchemaIdentifier = schemaIdentifier;

	let ieObject: IeObject | null = null;
	let showHard404IfNotFound = true;
	try {
		if (schemaIdentifier.length > MIN_LENGTH_SCHEMA_IDENTIFIER_V2) {
			// This is an old schema identifier (v2), we need to convert it to a new one (v3)
			const v3IdentifierResponse = await IeObjectsService.lookupV2Id(schemaIdentifier);
			newSchemaIdentifier = v3IdentifierResponse.schemaIdentifierV3;
		}

		ieObject = (await IeObjectsService.getBySchemaIdentifiers([newSchemaIdentifier], true))?.[0];
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
		seoInfo = await IeObjectsService.getSeoBySchemaIdentifier(newSchemaIdentifier);
	} catch (err) {
		console.error(`Failed to fetch media info by id: ${context.query.ie}`, err);
	}

	return getDefaultStaticProps(context, context.resolvedUrl, {
		queryClient: await prefetchDetailPageQueries(
			schemaIdentifier,
			(context.query.slug as string) || null,
			ieObject ?? null
		),
		schemaIdentifier: newSchemaIdentifier,
		title: seoInfo?.name,
		description: seoInfo?.description,
		image: seoInfo?.thumbnailUrl,
		maintainerSlug: seoInfo?.maintainerSlug ?? ieObject?.maintainerSlug ?? null,
	});
}

export default ObjectDetailPageEnglish;
