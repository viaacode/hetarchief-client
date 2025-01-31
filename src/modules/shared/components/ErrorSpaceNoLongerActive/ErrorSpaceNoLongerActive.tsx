import { Button } from '@meemoo/react-components';
import type { FC } from 'react';

import { ErrorPage } from '@shared/components/ErrorPage';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { tHtml } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';

interface ErrorSpaceNoLongerActiveProps {
	nlTranslations?: Record<string, string>;
}

const ErrorSpaceNoLongerActive: FC<ErrorSpaceNoLongerActiveProps> = () => {
	const locale = useLocale();

	return (
		<ErrorPage
			title={tHtml(
				'modules/shared/components/error-space-no-longer-active/error-space-no-longer-active___deze-aanbieder-heeft-geen-bezoekersruimte-meer'
			)}
			description={tHtml(
				'modules/shared/components/error-space-no-longer-active/error-space-no-longer-active___surf-naar-hetarchief-be-en-ontdek-alle-beschikbare-aanbieders'
			)}
			link={{
				component: (
					<Button
						label={tHtml(
							'modules/shared/components/error-space-no-longer-active/error-space-no-longer-active___zoek-in-de-publieke-catalogus'
						)}
						variants="black"
					/>
				),
				to: `/${ROUTE_PARTS_BY_LOCALE[locale].search}`,
			}}
			image={{ image: '/images/no-access.svg', left: true }}
		/>
	);
};

export default ErrorSpaceNoLongerActive;
