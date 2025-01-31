import type { GetServerSidePropsResult } from 'next';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { type ComponentType } from 'react';

import { AdminVisitorSpaceCreate } from '@admin/views/visitor-spaces/AdminVisitorSpaceCreate';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const VisitorSpaceCreateDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <AdminVisitorSpaceCreate url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.adminVisitorSpaceCreate);
}

export default withAuth(VisitorSpaceCreateDutch as ComponentType, true);
