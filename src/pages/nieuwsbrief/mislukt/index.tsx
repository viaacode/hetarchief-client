import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect, useState } from 'react';

import { Loading } from '@shared/components';
import { ROUTES } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { DefaultSeoInfo } from '@shared/types/seo';

const NewsletterFailed: NextPage<DefaultSeoInfo> = ({ url }) => {
	useHideFooter();

	const { tText, tHtml } = useTranslation();
	const router = useRouter();

	const [triggerRedirect, setTriggerRedirect] = useState(false);

	useEffect(() => {
		toastService.notify({
			maxLines: 3,
			title: tHtml('pages/nieuwsbrief-mislukt/index___nieuwsbrief-mislukt___mislukt'),
			description: tHtml(
				'pages/nieuwsbrief-mislukt/index___nieuwsbrief-mislukt___inschrijving-op-de-nieuwsbrief-is-mislukt'
			),
		});

		setTriggerRedirect(true);
	}, []);

	useEffect(() => {
		if (!triggerRedirect) {
			return;
		}

		router.replace(`/${ROUTES.home}`);
	}, [router, triggerRedirect]);

	return (
		<div className="p-newsletter-failed">
			{renderOgTags(
				tText('pages/nieuwsbrief-mislukt/index___nieuwsbrief-mislukt'),
				tText('pages/nieuwsbrief-mislukt/index___nieuwsbrief-mislukt-omschrijving'),
				url
			)}

			<Loading fullscreen owner="nieuwsbrief mislukt" />
		</div>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default NewsletterFailed;
