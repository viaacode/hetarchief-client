import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { ErrorPage } from '@shared/components';

const Error404: FC = () => {
	const { t } = useTranslation();
	return (
		<ErrorPage
			title="Oeps, we liggen er even uit."
			description={t(
				'We doen er alles aan om dit zo snel mogelijk op te lossen. Meer hulp of informatie nodig?'
			)}
			button={<Button label={t('Ga naar de homepage')} variants="black" />}
			image="/images/oops-offline.svg"
		/>
	);
};

export default Error404;
