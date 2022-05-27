import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';

import { ErrorPage } from '@shared/components';

interface ErrorSpaceNoAccessProps {
	visitorSpaceSlug: string | null;
	description: string;
}

const ErrorNoAccess: FC<ErrorSpaceNoAccessProps> = ({ visitorSpaceSlug, description }) => {
	const { t } = useTranslation();

	return (
		<ErrorPage
			title={
				visitorSpaceSlug
					? t(
							'modules/shared/components/error-space-no-access/error-space-no-access___geen-toegang-bezoekersruimte'
					  )
					: t('modules/shared/components/error-no-access/error-no-access___geen-toegang')
			}
			description={description}
			link={{
				component: <Button label={t('pages/404___ga-naar-de-homepage')} variants="black" />,
				to: '/',
			}}
			image={{ image: '/images/no-access.svg', left: true }}
		/>
	);
};

export default ErrorNoAccess;
