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

const NewsletterConfirmation: NextPage<DefaultSeoInfo> = ({ url }) => {
	useHideFooter();

	const { tText, tHtml } = useTranslation();
	const router = useRouter();

	const [triggerRedirect, setTriggerRedirect] = useState(false);

	useEffect(() => {
		toastService.notify({
			maxLines: 3,
			title: tHtml(
				'pages/nieuwsbrief-bevestiging/index___nieuwsbrief-bevestiging___bevestiging'
			),
			description: tHtml(
				'pages/nieuwsbrief-bevestiging/index___nieuwsbrief-bevestiging___inschrijving-op-de-nieuwsbrief-is-gelukt'
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
		<div className="p-newsletter-confirmation">
			{renderOgTags(
				tText('pages/nieuwsbrief-bevestiging/index___nieuwsbrief-bevestiging'),
				tText('pages/nieuwsbrief-bevestiging/index___nieuwsbrief-bevestiging-omschrijving'),
				url
			)}

			<Loading owner="nieuwsbrief bevestiging" fullscreen />
		</div>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default NewsletterConfirmation;
