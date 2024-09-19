import { type GetServerSidePropsResult } from 'next';
import { type GetServerSidePropsContext } from 'next/types';
import React, { type ComponentType, type FC } from 'react';

import { AdminVisitorSpaceEdit } from '@admin/views/visitor-spaces/AdminVisitorSpaceEdit';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const VisitorSpaceEditDutch: FC<DefaultSeoInfo> = ({ url, locale }) => {
	return <AdminVisitorSpaceEdit url={url} locale={locale} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(VisitorSpaceEditDutch as ComponentType, true);
