import { getIeObjectDetailPageServerSideProps } from '@ie-objects/get-ie-object-detail-page-ssr-props';
import { ObjectDetailPage } from '@ie-objects/ObjectDetailPage';
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
	canonicalUrl,
}) => {
	return (
		<ObjectDetailPage
			title={title}
			description={description}
			image={image}
			url={url}
			locale={locale}
			canonicalUrl={canonicalUrl}
		/>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getIeObjectDetailPageServerSideProps(context);
}

export default ObjectDetailPageEnglish;
