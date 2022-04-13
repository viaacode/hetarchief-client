import { Button } from '@meemoo/react-components';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { withI18n } from '@i18n/wrappers';
import { ErrorPage } from '@shared/components';

const Error404: FC = () => {
	const { t } = useTranslation();

	return (
		<ErrorPage
			title={t('pages/404___404')}
			description={t(
				'pages/404___sorry-deze-pagina-konden-we-niet-terugvinden-de-link-die-je-volgde-kan-stuk-zijn-of-de-pagina-kan-niet-meer-bestaan'
			)}
			link={{
				component: <Button label={t('pages/404___ga-naar-de-homepage')} variants="black" />,
				to: '/',
			}}
			image={{ image: '/images/404.svg', left: true }}
		/>
	);
};

export const getStaticProps: GetStaticProps = withI18n();

export default Error404;
