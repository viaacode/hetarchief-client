import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { ErrorPage } from '@shared/components';

const Error404: FC = () => {
	const { t } = useTranslation();

	return (
		<ErrorPage
			title={t('404')}
			description={t(
				'Sorry! Deze pagina konden we niet terugvinden. De link die je volgde kan stuk zijn of de pagina kan niet meer bestaan.'
			)}
			button={<Button label={t('Ga naar de homepage')} variants="black" />}
			image={{ image: '/images/404.svg', left: true }}
		/>
	);
};

export default Error404;
