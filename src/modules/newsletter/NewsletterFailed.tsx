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

export const NewsletterFailed: FC<DefaultSeoInfo> = ({ url }) => {
	useHideFooter();

	const { tText, tHtml } = useTranslation();
	const router = useRouter();
	const locale = useLocale();

	const [triggerRedirect, setTriggerRedirect] = useState(false);

	useEffect(() => {
		toastService.notify({
			maxLines: 3,
			title: tHtml('pages/nieuwsbrief-mislukt/index___nieuwsbrief-mislukt-mislukt'),
			description: tHtml(
				'pages/nieuwsbrief-mislukt/index___nieuwsbrief-mislukt-inschrijving-op-de-nieuwsbrief-is-mislukt'
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
		<div className="p-newsletter-failed">
			<SeoTags
				title={tText('pages/nieuwsbrief-mislukt/index___nieuwsbrief-mislukt')}
				description={tText(
					'pages/nieuwsbrief-mislukt/index___nieuwsbrief-mislukt-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<Loading fullscreen owner="nieuwsbrief mislukt" />
		</div>
	);
};
