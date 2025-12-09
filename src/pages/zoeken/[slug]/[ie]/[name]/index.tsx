import type { IeObject } from '@ie-objects/ie-objects.types';
import { ObjectDetailPage } from '@ie-objects/ObjectDetailPage';
import { prefetchDetailPageQueries } from '@ie-objects/ObjectDetailPage.helpers';
import { IeObjectsService } from '@ie-objects/services';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { NextPage } from 'next';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types';
import React from 'react';

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
	let showHard404IfNotFound = true;
	try {
		ieObject = (await IeObjectsService.getBySchemaIdentifiers([schemaIdentifier]))?.[0];
		// biome-ignore lint/suspicious/noExplicitAny: we just do not know
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

	return getDefaultStaticProps(context, context.resolvedUrl, {
		queryClient: await prefetchDetailPageQueries(
			schemaIdentifier,
			ieObject?.maintainerId,
			ieObject?.maintainerSlug
		),
		schemaIdentifier,
	});
}

export default ObjectDetailPageDutch;
