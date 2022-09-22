import { Button } from '@meemoo/react-components';
import { FC, ReactNode } from 'react';

import { ErrorPage } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';

interface ErrorSpaceNoAccessProps {
	visitorSpaceSlug: string | null;
	description: string | ReactNode;
}

const ErrorNoAccess: FC<ErrorSpaceNoAccessProps> = ({ visitorSpaceSlug, description }) => {
	const { tHtml } = useTranslation();

	return (
		<ErrorPage
			title={
				visitorSpaceSlug
					? tHtml(
							'modules/shared/components/error-space-no-access/error-space-no-access___geen-toegang-bezoekersruimte'
					  )
					: tHtml(
							'modules/shared/components/error-no-access/error-no-access___geen-toegang'
					  )
			}
			description={description}
			link={{
				component: (
					<Button label={tHtml('pages/404___ga-naar-de-homepage')} variants="black" />
				),
				to: '/',
			}}
			image={{ image: '/images/no-access.svg', left: true }}
		/>
	);
};

export default ErrorNoAccess;
