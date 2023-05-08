import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

const NewsletterFailed: NextPage<DefaultSeoInfo> = ({ url }) => {
	useHideFooter();

	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<>
				<h1>NIEUWSBRIEF PAGINA - MISLUKT</h1>
			</>
		);
	};

	return (
		<div className="p-newsletter-failed">
			{renderOgTags(
				tText('pages/nieuwsbrief-mislukt/index___nieuwsbrief-mislukt'),
				tText('pages/nieuwsbrief-mislukt/index___nieuwsbrief-mislukt-omschrijving'),
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

export default NewsletterFailed;
