import { GetStaticProps, NextPage } from 'next';

import { ErrorNotFound } from '@shared/components';

const NotFoundPage: NextPage = () => {
	return <ErrorNotFound />;
};

// export const getStaticProps: GetStaticProps = withI18n();

export default NotFoundPage;
