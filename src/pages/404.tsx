import { NextPage } from 'next';

import { ErrorNotFound } from '@shared/components';
import { ApiService } from '@shared/services/api-service';

interface NotFoundPageProps {
	nlTranslations: Record<string, string>;
}

const NotFoundPage: NextPage<NotFoundPageProps> = ({ nlTranslations }) => {
	return <ErrorNotFound nlTranslations={nlTranslations} />;
};

export async function getStaticProps(): Promise<{ props: unknown }> {
	const response = await ApiService.getApi().get('translations/nl.json');

	return {
		props: {
			nlTranslations: await response.json(),
		},
	};
}

export default NotFoundPage;
