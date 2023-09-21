import { NextPage } from 'next';

import { ErrorNotFound } from '@shared/components';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useHideNavigationHeaderRight from '@shared/hooks/use-hide-navigation-header-right/use-hide-navigation-header-right';
import { isBrowser } from '@shared/utils';

import useHideFooter from '../modules/shared/hooks/use-hide-footer/use-hide-footer';

const NotFound: NextPage = () => {
	useHideFooter();
	useHideNavigationHeaderRight();

	return (
		<>
			{renderOgTags(
				'Niet gevonden | hetarchief',
				'Pagina niet gevonden',
				(isBrowser() ? window.location.href : process.env.HOST) as string,
				true
			)}
			<ErrorNotFound />
		</>
	);
};

export default NotFound;
