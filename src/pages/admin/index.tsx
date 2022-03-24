import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { withI18n } from '@i18n/wrappers';
import { setShowFooter, setShowZendesk } from '@shared/store/ui';

const DynamicAdmin = dynamic(() => import('modules/admin'), { ssr: false });

const Admin: NextPage = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setShowZendesk(false));
		dispatch(setShowFooter(false));
	}, [dispatch]);

	return <DynamicAdmin />;
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default Admin;
