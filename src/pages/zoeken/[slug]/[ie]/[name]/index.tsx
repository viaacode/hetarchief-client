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
	try {
		ieObject = (await IeObjectsService.getBySchemaIdentifiers([schemaIdentifier]))?.[0];
	} catch (_err) {
		return { notFound: true };
	}

	if (!ieObject) {
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
