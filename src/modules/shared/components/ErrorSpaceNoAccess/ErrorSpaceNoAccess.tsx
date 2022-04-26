import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { stringifyUrl } from 'query-string';
import { FC } from 'react';

import { VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
import { ErrorPage } from '@shared/components';

interface ErrorSpaceNoAccessProps {
	visitorSpaceSlug: string;
}

const ErrorSpaceNoAccess: FC<ErrorSpaceNoAccessProps> = ({ visitorSpaceSlug }) => {
	const { t } = useTranslation();

	return (
		<ErrorPage
			title={t(
				'modules/shared/components/error-space-no-access/error-space-no-access___geen-toegang-bezoekersruimte'
			)}
			description={t(
				'modules/shared/components/error-space-no-access/error-space-no-access___je-hebt-geen-toegang-tot-deze-bezoekersruimte-dien-een-aanvraag-in-om-deze-te-bezoeken'
			)}
			link={{
				component: <Button label={t('pages/404___ga-naar-de-homepage')} variants="black" />,
				to: stringifyUrl({
					url: '/',
					query: { [VISITOR_SPACE_SLUG_QUERY_KEY]: visitorSpaceSlug },
				}),
			}}
			image={{ image: '/images/no-access.svg', left: true }}
		/>
	);
};

export default ErrorSpaceNoAccess;
