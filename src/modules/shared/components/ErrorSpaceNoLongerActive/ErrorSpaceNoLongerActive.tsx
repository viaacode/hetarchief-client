import { Button } from '@meemoo/react-components';
import { FC } from 'react';

import { ErrorPage } from '@shared/components';
import { ROUTE_PARTS } from '@shared/const';
import useTranslation from '@shared/hooks/use-translation/use-translation';

interface ErrorSpaceNoLongerActiveProps {
	nlTranslations?: Record<string, string>;
}

const ErrorSpaceNoLongerActive: FC<ErrorSpaceNoLongerActiveProps> = () => {
	const { tHtml } = useTranslation();

	return (
		<ErrorPage
			title={tHtml('Deze aanbieder heeft geen bezoekersruimte meer')}
			description={tHtml('Surf naar hetarchief.be en ontdek alle beschikbare aanbieders')}
			link={{
				component: (
					<Button label={tHtml('Zoek in de publieke catalogus')} variants="black" />
				),
				to: `/${ROUTE_PARTS.search}`,
			}}
			image={{ image: '/images/no-access.svg', left: true }}
		/>
	);
};

export default ErrorSpaceNoLongerActive;
