import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

const Newsletter: NextPage<DefaultSeoInfo> = ({ url }) => {
	useHideFooter();

	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<>
				<h1>NIEUWSBRIEF PAGINA</h1>
			</>
		);
	};

	return (
		<div className="p-newsletter">
			{renderOgTags(
				tText('pages/nieuwsbrief/index___nieuwsbrief'),
				tText('pages/nieuwsbrief/index___nieuwsbrief-omschrijving'),
				url
			)}

			{renderPageContent()}
		</div>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default Newsletter;
