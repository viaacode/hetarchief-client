import { GetStaticProps, NextPage } from 'next';

import { withI18n } from '@i18n/wrappers';
import { ErrorNotFound } from '@shared/components';

const NotFoundPage: NextPage = () => {
	return <ErrorNotFound />;
};

export const getStaticProps: GetStaticProps = withI18n();

export default NotFoundPage;
