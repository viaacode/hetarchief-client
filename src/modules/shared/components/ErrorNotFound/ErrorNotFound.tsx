import { Button } from '@meemoo/react-components';
import type { FC } from 'react';

import { ErrorPage } from '@shared/components/ErrorPage';

interface ErrorNotFoundProps {
	nlTranslations?: Record<string, string>;
}

const ErrorNotFound: FC<ErrorNotFoundProps> = () => {
	// 404 page does not support translations: https://nextjs.org/docs/messages/404-get-initial-props
	return (
		<ErrorPage
			title="Niet gevonden (404)"
			description="Sorry, deze pagina konden we niet terugvinden. Misschien is er iets mis met de link die je volgde of bestaat de pagina niet meer."
			link={{
				component: (
					<Button
						label="Ga naar de startpagina"
						variants="black"
						// Reload the page after going to the homepage because of nextjs issues:
						// https://github.com/vercel/next.js/issues/37005
						onClick={() => window.open(window.location.origin, '_self')}
					/>
				),
				to: null,
			}}
			image={{ image: '/images/404.svg', left: true }}
		/>
	);
};

export default ErrorNotFound;
