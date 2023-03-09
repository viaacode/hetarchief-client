import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ComponentType } from 'react';
import { Redirect } from 'react-router';

import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { ROUTE_PARTS } from '@shared/const';
import { VisitorSpaceFilterId } from '@visitor-space/types';

const VisitorSpaceRedirectToSearch: NextPage = () => {
	const router = useRouter();
	const { slug } = router.query;

	return <Redirect to={`/${ROUTE_PARTS.search}?${[VisitorSpaceFilterId.Maintainer]}=${slug}`} />;
};

export default withAdminCoreConfig(VisitorSpaceRedirectToSearch as ComponentType);
