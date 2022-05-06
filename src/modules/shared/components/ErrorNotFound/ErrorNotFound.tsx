import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { ErrorPage } from '@shared/components';

interface ErrorNotFoundProps {
	nlTranslations?: Record<string, string>;
}

const ErrorNotFound: FC<ErrorNotFoundProps> = () => {
	const { t } = useTranslation();

	return (
		<ErrorPage
			title={t('modules/shared/components/error-not-found/error-not-found___404')}
			description={t(
				'modules/shared/components/error-not-found/error-not-found___sorry-deze-pagina-konden-we-niet-terugvinden-de-link-die-je-volgde-kan-stuk-zijn-of-de-pagina-kan-niet-meer-bestaan'
			)}
			link={{
				component: <Button label={t('pages/404___ga-naar-de-homepage')} variants="black" />,
				to: '/',
			}}
			image={{ image: '/images/404.svg', left: true }}
		/>
	);
};

export default ErrorNotFound;
