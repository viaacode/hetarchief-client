import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC } from 'react';

import { AdminVisitorSpaceEdit } from '@admin/views/visitor-spaces/[slug]';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const VisitorSpaceEditEnglish: FC<DefaultSeoInfo> = ({ url }) => {
	return <AdminVisitorSpaceEdit url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(VisitorSpaceEditEnglish as ComponentType, true);
