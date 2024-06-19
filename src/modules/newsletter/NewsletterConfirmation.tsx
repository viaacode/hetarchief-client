import { useRouter } from 'next/router';
import { type FC, useEffect, useState } from 'react';

import { Loading } from '@shared/components/Loading';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { type DefaultSeoInfo } from '@shared/types/seo';

export const NewsletterConfirmation: FC<DefaultSeoInfo> = ({ url }) => {
	useHideFooter();

	const { tText, tHtml } = useTranslation();
	const router = useRouter();
	const locale = useLocale();

	const [triggerRedirect, setTriggerRedirect] = useState(false);

	useEffect(() => {
		toastService.notify({
			maxLines: 3,
			title: tHtml(
				'pages/nieuwsbrief-bevestiging/index___nieuwsbrief-bevestiging-bevestiging'
			),
			description: tHtml(
				'pages/nieuwsbrief-bevestiging/index___nieuwsbrief-bevestiging-inschrijving-op-de-nieuwsbrief-is-gelukt'
			),
		});

		setTriggerRedirect(true);
	}, [tHtml]);

	useEffect(() => {
		if (!triggerRedirect) {
			return;
		}

		router.replace(`/${ROUTES_BY_LOCALE[locale].home}`);
	}, [locale, router, triggerRedirect]);

	return (
		<div className="p-newsletter-confirmation">
			<SeoTags
				title={tText('pages/nieuwsbrief-bevestiging/index___nieuwsbrief-bevestiging')}
				description={tText(
					'pages/nieuwsbrief-bevestiging/index___nieuwsbrief-bevestiging-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<Loading owner="nieuwsbrief bevestiging" fullscreen />
		</div>
	);
};
