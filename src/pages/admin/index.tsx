import { NextPage } from 'next';
import dynamic from 'next/dynamic';

const DynamicAdmin = dynamic(() => import('modules/admin'), { ssr: false });

const Admin: NextPage = () => {
	return <DynamicAdmin />;
};

export default Admin;
